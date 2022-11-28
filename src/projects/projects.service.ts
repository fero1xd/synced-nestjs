import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { BoilerPlate } from 'src/utils/boilerplate';
import { Events, Services } from 'src/utils/constants';
import { Project, User } from 'src/utils/typeorm/entities';
import {
  CreateProjectParams,
  DeleteProjectParams,
  GetProjectByIdParams,
  SaveProjectParams,
  TransferOwnershipParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private eventEmitter: EventEmitter2,
    @Inject(Services.USERS_SERVICE)
    private readonly usersService: UsersService,
  ) {}

  async getAllProjects(user: User, isPublic: boolean) {
    return isPublic
      ? await this.projectRepository
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.owner', 'owner')
          .leftJoinAndSelect('project.collaborators', 'collaborator')
          .where(
            'isPublic = true AND (collaborator.id IN (:users) OR owner.id = :ownerId)',
            {
              users: [user.id],
              ownerId: user.id,
            },
          )
          .leftJoinAndSelect('project.collaborators', 'collaborators')
          .orderBy('project.updatedAt', 'DESC')
          .getMany()
      : await this.projectRepository
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.owner', 'owner')
          .where('owner.id = :ownerId', { ownerId: user.id })
          .andWhere('isPublic = false')
          .leftJoinAndSelect('project.collaborators', 'collaborators')
          .orderBy('project.updatedAt', 'DESC')
          .getMany();
  }

  async getProjectById(params: GetProjectByIdParams) {
    const { id, user } = params;

    const project = await this.projectExists(null, user, id);

    if (!project) throw new NotFoundException('Project not found');

    project.owner.password = undefined;
    project.collaborators = project.collaborators.map((c) => ({
      ...c,
      password: undefined,
    }));

    return project;
  }

  async createProject(params: CreateProjectParams) {
    const { name, language, description, code, user, isPublic } = params;

    const pr = await this.projectExists(name.toLowerCase(), user);

    if (pr) {
      throw new BadRequestException(
        'Project with this name is already created for this user',
      );
    }

    return await this.projectRepository.save(
      this.projectRepository.create({
        name,
        owner: user,
        description: description || undefined,
        language,
        code: code || BoilerPlate[language.toUpperCase()] || '',
        isPublic: isPublic || false,
        collaborators: [user],
      }),
    );
  }

  async saveProject(params: SaveProjectParams) {
    const { id, name, language, code, user, description, isPublic } = params;

    if (
      !name &&
      !language &&
      !code &&
      !description &&
      typeof isPublic !== 'boolean'
    )
      throw new BadRequestException('No update done');

    const project = await this.projectExists(null, user, id);

    if (!project) throw new NotFoundException('Project not found');
    if ((name || language) && project.owner.id !== user.id)
      throw new UnauthorizedException();

    if (name) {
      const exist = await this.projectExists(name.toLowerCase(), user);
      if (exist && exist.id !== project.id) {
        throw new BadRequestException(
          'Project with this name is already created for this user',
        );
      }
      project.name = name;
    }
    if (language) project.language = language;

    if (code) project.code = code;
    if (description) project.description = description;

    if (typeof isPublic === 'boolean') {
      project.isPublic = isPublic;
    }

    if (project.isPublic) {
      this.eventEmitter.emit(Events.OnProjectUpdate, user, project);
    }

    return await this.projectRepository.save(project);
  }

  async transferOwnership(params: TransferOwnershipParams) {
    const { user, projectId, userToTransferEmail } = params;

    const project = await this.projectExists(null, user, projectId);
    if (!project) throw new NotFoundException('Project not found');
    if (project.owner.id !== user.id)
      throw new BadRequestException('Unauthorized');

    const userToTransfer = await this.usersService.userExists(
      userToTransferEmail,
    );
    if (!userToTransfer) throw new NotFoundException('User not found');

    const isCollaborator = project.collaborators.some(
      (c) => c.email === userToTransfer.email,
    );
    if (!isCollaborator)
      throw new BadRequestException(
        'This user is not a collaborator in this project',
      );

    project.owner = userToTransfer;
    return await this.projectRepository.save(project);
  }

  async deleteProject(params: DeleteProjectParams) {
    const { id, user } = params;

    const project = await this.projectExists(null, user, id);

    if (!project) throw new NotFoundException('Project not found');
    if (project.owner.id !== user.id) throw new UnauthorizedException();

    await this.projectRepository.remove(project);
  }

  async projectExists(name: string, user: User, id?: string) {
    return id
      ? await this.projectRepository
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.owner', 'owner')
          .leftJoinAndSelect('project.collaborators', 'collaborator')
          .where(
            'project.id = :projectId AND (owner.id = :ownerId OR (isPublic = true AND collaborator.id IN (:users)))',
            {
              projectId: id,
              ownerId: user.id,
              users: [user.id],
            },
          )
          .leftJoinAndSelect('project.collaborators', 'collaborators')
          .getOne()
      : await this.projectRepository
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.owner', 'owner')
          .leftJoinAndSelect('project.collaborators', 'collaborator')
          .where(
            'LOWER(project.name) = LOWER(:name) AND (owner.id = :ownerId OR (isPublic = true AND collaborator.id IN (:users)))',
            {
              name,
              ownerId: user.id,
              users: [user.id],
            },
          )
          .leftJoinAndSelect('project.collaborators', 'collaborators')
          .getOne();
  }
}

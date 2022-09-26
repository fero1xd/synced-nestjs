import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, User } from 'src/utils/typeorm/entities';
import {
  CreateProjectParams,
  DeleteProjectParams,
  GetProjectByIdParams,
  SaveProjectParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getAllProjects(user: User) {
    return await this.projectRepository.find({
      where: { owner: { id: user.id } },
    });
  }

  async getProjectById(params: GetProjectByIdParams) {
    const { id, user } = params;

    const project = await this.projectExists(null, user, id);
    if (!project) throw new NotFoundException('Project not found');

    return project;
  }

  async createProject(params: CreateProjectParams) {
    const { name, language, code, user } = params;

    if (await this.projectExists(name.toLocaleLowerCase(), user))
      throw new BadRequestException(
        'Project with this name is already created for this user',
      );

    return await this.projectRepository.save(
      this.projectRepository.create({
        name: name.toLocaleLowerCase(),
        owner: user,
        language,
        code,
      }),
    );
  }

  async saveProject(params: SaveProjectParams) {
    const { id, name, language, code, user } = params;

    if (!name && !language && !code)
      throw new BadRequestException('No update done');

    const project = await this.projectExists(null, user, id);

    if (!project) throw new NotFoundException('Project not found');

    if (name) project.name = name;
    if (language) project.language = language;
    if (code) project.code = code;

    return await this.projectRepository.save(project);
  }

  async deleteProject(params: DeleteProjectParams) {
    const { id, user } = params;

    const project = await this.projectExists(null, user, id);

    if (!project) throw new NotFoundException('Project not found');

    await this.projectRepository.remove(project);
  }

  private async projectExists(name: string, user: User, id?: string) {
    return id
      ? await this.projectRepository.findOne({
          where: { id, owner: { id: user.id } },
        })
      : await this.projectRepository.findOne({
          where: { name, owner: { id: user.id } },
        });
  }
}

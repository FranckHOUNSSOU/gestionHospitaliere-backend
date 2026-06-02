import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chambre } from './chambre.entity';
import { ServiceService } from './service.service';
import { CreateChambreDto } from './dto/create-chambre.dto';
import { UpdateChambreDto } from './dto/update-chambre.dto';

@Injectable()
export class ChambreService {
  constructor(
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
    private readonly serviceService: ServiceService,
  ) {}

  async create(serviceId: string, dto: CreateChambreDto): Promise<Chambre> {
    const service = await this.serviceService.findOne(serviceId);

    const numeroExistant = await this.chambreRepository.findOne({
      where: { numero: dto.numero, service: { id: serviceId } },
    });
    if (numeroExistant) {
      throw new ConflictException(
        `Le numéro "${dto.numero}" est déjà utilisé dans ce service.`,
      );
    }

    const chambre = this.chambreRepository.create({
      ...dto,
      designation: dto.designation ?? null,
      etage:       dto.etage       ?? null,
      service,
    });
    return this.chambreRepository.save(chambre);
  }

  async findByService(serviceId: string): Promise<Chambre[]> {
    await this.serviceService.findOne(serviceId);
    return this.chambreRepository.find({
      where: { service: { id: serviceId } },
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Chambre> {
    const chambre = await this.chambreRepository.findOne({ where: { id } });
    if (!chambre) throw new NotFoundException('Chambre introuvable.');
    return chambre;
  }

  async update(id: string, dto: UpdateChambreDto): Promise<Chambre> {
    const chambre = await this.findOne(id);

    if (dto.numero && dto.numero !== chambre.numero) {
      const numeroExistant = await this.chambreRepository.findOne({
        where: { numero: dto.numero, service: { id: chambre.service.id } },
      });
      if (numeroExistant) {
        throw new ConflictException(
          `Le numéro "${dto.numero}" est déjà utilisé dans ce service.`,
        );
      }
    }

    Object.assign(chambre, dto);
    return this.chambreRepository.save(chambre);
  }

  // ── SUPPRIMER UNE CHAMBRE ─────────────────────────────────────────────────
  async remove(id: string): Promise<void> {
    const chambre = await this.findOne(id);
    await this.chambreRepository.remove(chambre);
  }
}
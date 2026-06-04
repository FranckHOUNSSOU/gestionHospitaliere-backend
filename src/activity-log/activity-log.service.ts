import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import {
  startOfDay, endOfDay,
  startOfMonth, endOfMonth,
  subMonths, subDays,
} from 'date-fns';
import { ActivityLog, LogModule } from './activity-log.entity';
import { FilterLogsDto, PeriodePredefinie } from './dto/filter-logs.dto';

export interface LogData {
  actorId:   string | null;
  actorNom:  string | null;
  actorRole: string | null;
  action:    string;
  description: string;
  module:    LogModule;
  cible?:    string | null;
  cibleId?:  string | null;
}

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly repo: Repository<ActivityLog>,
  ) {}

  log(data: LogData): void {
    const entry = this.repo.create(data);
    this.repo.save(entry).catch(() => {});
  }

  async findAll(filters: FilterLogsDto): Promise<{ data: ActivityLog[]; total: number; page: number; limit: number }> {
    const page  = filters.page  ?? 1;
    const limit = filters.limit ?? 50;
    const skip  = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('log')
      .orderBy('log.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    // ── Filtre par module ──────────────────────────────────────────────────
    if (filters.module) {
      qb.andWhere('log.module = :module', { module: filters.module });
    }

    // ── Filtre par période ─────────────────────────────────────────────────
    const now = new Date();
    if (filters.periode) {
      switch (filters.periode) {
        case PeriodePredefinie.AUJOURD_HUI:
          qb.andWhere('log.createdAt BETWEEN :debut AND :fin', {
            debut: startOfDay(now),
            fin:   endOfDay(now),
          });
          break;
        case PeriodePredefinie.HIER: {
          const hier = subDays(now, 1);
          qb.andWhere('log.createdAt BETWEEN :debut AND :fin', {
            debut: startOfDay(hier),
            fin:   endOfDay(hier),
          });
          break;
        }
        case PeriodePredefinie.MOIS_EN_COURS:
          qb.andWhere('log.createdAt BETWEEN :debut AND :fin', {
            debut: startOfMonth(now),
            fin:   endOfMonth(now),
          });
          break;
        case PeriodePredefinie.MOIS_DERNIER: {
          const moisPrec = subMonths(now, 1);
          qb.andWhere('log.createdAt BETWEEN :debut AND :fin', {
            debut: startOfMonth(moisPrec),
            fin:   endOfMonth(moisPrec),
          });
          break;
        }
      }
    } else if (filters.dateDebut || filters.dateFin) {
      if (filters.dateDebut && filters.dateFin) {
        qb.andWhere('log.createdAt BETWEEN :debut AND :fin', {
          debut: startOfDay(new Date(filters.dateDebut)),
          fin:   endOfDay(new Date(filters.dateFin)),
        });
      } else if (filters.dateDebut) {
        qb.andWhere('log.createdAt >= :debut', {
          debut: startOfDay(new Date(filters.dateDebut)),
        });
      } else {
        qb.andWhere('log.createdAt <= :fin', {
          fin: endOfDay(new Date(filters.dateFin!)),
        });
      }
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async stats(): Promise<{ total: number; aujourd_hui: number; cette_semaine: number }> {
    const now = new Date();
    const [total, aujourd_hui, cette_semaine] = await Promise.all([
      this.repo.count(),
      this.repo.count({ where: { createdAt: Between(startOfDay(now), endOfDay(now)) } }),
      this.repo.count({ where: { createdAt: MoreThanOrEqual(subDays(startOfDay(now), 6)) } }),
    ]);
    return { total, aujourd_hui, cette_semaine };
  }
}

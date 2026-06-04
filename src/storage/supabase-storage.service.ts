import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@Injectable()
export class SupabaseStorageService {
  private supabase: SupabaseClient;
  private readonly bucket = 'document-diplome-medecin';

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );
  }

  async uploadDocument(
    file: Express.Multer.File,
    medecinId: string,
  ): Promise<string> {
    const ext = extname(file.originalname);
    const filename = `${uuid()}${ext}`;
    const path = `medecins/${medecinId}/${filename}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(`Upload échoué : ${error.message}`);
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async uploadUserPhoto(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const ext = extname(file.originalname);
    const filename = `photo${ext}`;
    const path = `users/${userId}/${filename}`;

    await this.supabase.storage
      .from(this.bucket)
      .remove([path])
      .catch(() => {});

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new InternalServerErrorException(`Upload photo échoué : ${error.message}`);
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async deleteDocument(publicUrl: string): Promise<void> {
    try {
      const url = new URL(publicUrl);
      const pathParts = url.pathname.split(`/object/public/${this.bucket}/`);
      if (pathParts.length < 2) return;
      await this.supabase.storage.from(this.bucket).remove([pathParts[1]]);
    } catch {
      // Ne pas bloquer si la suppression échoue
    }
  }
}

import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllNotes(id: string) {
    return await this.prisma.note.findMany({
      where: {
        userId: id,
      },
    });
  }

  async getNote(userId: string, id: string) {
    return await this.prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async createNote(userId: string, data: CreateNoteDto) {
    return await this.prisma.note.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateNote(userId: string, id: string, data: UpdateNoteDto) {
    return await this.prisma.note.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  async deleteNote(userId: string, id: string) {
    return this.prisma.note.delete({
      where: {
        id,
        userId,
      },
    });
  }
}

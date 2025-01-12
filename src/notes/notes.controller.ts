import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get(':id')
  getAllNotes(@Param('id') id: string) {
    return this.notesService.getAllNotes(id);
  }

  @Get(':id/:noteId')
  getNote(@Param('id') id: string, @Param('noteId') noteId: string) {
    return this.notesService.getNote(id, noteId);
  }

  @Post(':id')
  createNote(@Param('id') id: string, @Body() data: CreateNoteDto) {
    return this.notesService.createNote(id, data);
  }

  @Put(':id/:noteId')
  updateNote(
    @Param('id') id: string,
    @Param('noteId') noteId: string,
    @Body() data: UpdateNoteDto,
  ) {
    return this.notesService.updateNote(id, noteId, data);
  }

  @Delete(':id/:noteId')
  deleteNote(@Param('id') id: string, @Param('noteId') noteId: string) {
    return this.notesService.deleteNote(id, noteId);
  }
}

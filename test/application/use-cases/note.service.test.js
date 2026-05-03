import { jest } from '@jest/globals';
import NoteService from '../../../src/application/use-cases/note.service.js';

describe('NoteService', () => {
    let noteService;
    let mockNoteRepository;
    let mockMailService;

    beforeEach(() => {
        mockNoteRepository = {
            save: jest.fn(),
            findByUserId: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        mockMailService = {
            sendMail: jest.fn(),
        };
        noteService = new NoteService(mockNoteRepository, mockMailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ─── createNote ─────────────────────────────────────────────
    describe('createNote', () => {
        it('should create a note successfully', async () => {
            const noteData = { title: 'Test Note', content: 'Test Content', userId: 'user1' };
            mockNoteRepository.save.mockResolvedValue({ id: '1', ...noteData });

            const result = await noteService.createNote(noteData);

            expect(mockNoteRepository.save).toHaveBeenCalled();
            expect(result).toEqual({ id: '1', ...noteData });
        });

        it('should throw an error if title is missing', async () => {
            const noteData = { content: 'Test Content', userId: 'user1' };

            await expect(noteService.createNote(noteData)).rejects.toThrow('Title and content are required');
            expect(mockNoteRepository.save).not.toHaveBeenCalled();
        });

        it('should throw an error if content is missing', async () => {
            const noteData = { title: 'Test Note', userId: 'user1' };

            await expect(noteService.createNote(noteData)).rejects.toThrow('Title and content are required');
            expect(mockNoteRepository.save).not.toHaveBeenCalled();
        });
    });

    // ─── getNotesByUserId ───────────────────────────────────────
    describe('getNotesByUserId', () => {
        it('should return notes for a given user', async () => {
            const mockNotes = [
                { id: '1', title: 'Note 1', content: 'Content 1', userId: 'user1' },
                { id: '2', title: 'Note 2', content: 'Content 2', userId: 'user1' },
            ];
            mockNoteRepository.findByUserId.mockResolvedValue(mockNotes);

            const result = await noteService.getNotesByUserId('user1');

            expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith('user1');
            expect(result).toEqual(mockNotes);
            expect(result).toHaveLength(2);
        });

        it('should return empty array if user has no notes', async () => {
            mockNoteRepository.findByUserId.mockResolvedValue([]);

            const result = await noteService.getNotesByUserId('user1');

            expect(result).toEqual([]);
        });
    });

    // ─── getAllNotes ─────────────────────────────────────────────
    describe('getAllNotes', () => {
        it('should return all notes', async () => {
            const mockNotes = [
                { id: '1', title: 'Note 1', content: 'Content 1', userId: 'user1' },
                { id: '2', title: 'Note 2', content: 'Content 2', userId: 'user2' },
            ];
            mockNoteRepository.findAll.mockResolvedValue(mockNotes);

            const result = await noteService.getAllNotes();

            expect(mockNoteRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockNotes);
        });
    });

    // ─── getNoteById ────────────────────────────────────────────
    describe('getNoteById', () => {
        it('should return a note if the user is the owner', async () => {
            const mockNote = { id: '1', title: 'Note 1', content: 'Content 1', userId: 'user1' };
            mockNoteRepository.findById.mockResolvedValue(mockNote);

            const result = await noteService.getNoteById('1', 'user1');

            expect(mockNoteRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockNote);
        });

        it('should throw an error if note is not found', async () => {
            mockNoteRepository.findById.mockResolvedValue(null);

            await expect(noteService.getNoteById('999', 'user1')).rejects.toThrow('Note not found');
        });

        it('should throw an error if user is not the owner', async () => {
            const mockNote = { id: '1', title: 'Note 1', content: 'Content 1', userId: 'user1' };
            mockNoteRepository.findById.mockResolvedValue(mockNote);

            await expect(noteService.getNoteById('1', 'user2')).rejects.toThrow('Not authorized to view this note');
        });
    });

    // ─── updateNote ─────────────────────────────────────────────
    describe('updateNote', () => {
        it('should update a note successfully', async () => {
            const existingNote = { id: '1', title: 'Old Title', content: 'Old Content', userId: 'user1' };
            const updatedNote = { id: '1', title: 'New Title', content: 'New Content', userId: 'user1' };
            mockNoteRepository.findById.mockResolvedValue(existingNote);
            mockNoteRepository.update.mockResolvedValue(updatedNote);

            const result = await noteService.updateNote('1', { title: 'New Title', content: 'New Content' }, 'user1');

            expect(mockNoteRepository.findById).toHaveBeenCalledWith('1');
            expect(mockNoteRepository.update).toHaveBeenCalledWith('1', { title: 'New Title', content: 'New Content' });
            expect(result).toEqual(updatedNote);
        });

        it('should throw an error if note is not found', async () => {
            mockNoteRepository.findById.mockResolvedValue(null);

            await expect(noteService.updateNote('999', { title: 'X' }, 'user1')).rejects.toThrow('Note not found');
            expect(mockNoteRepository.update).not.toHaveBeenCalled();
        });

        it('should throw an error if user is not the owner', async () => {
            const existingNote = { id: '1', title: 'Title', content: 'Content', userId: 'user1' };
            mockNoteRepository.findById.mockResolvedValue(existingNote);

            await expect(noteService.updateNote('1', { title: 'X' }, 'user2')).rejects.toThrow('Not authorized to update this note');
            expect(mockNoteRepository.update).not.toHaveBeenCalled();
        });
    });

    // ─── deleteNote ─────────────────────────────────────────────
    describe('deleteNote', () => {
        it('should delete a note successfully', async () => {
            const existingNote = { id: '1', title: 'Title', content: 'Content', userId: 'user1' };
            mockNoteRepository.findById.mockResolvedValue(existingNote);
            mockNoteRepository.delete.mockResolvedValue();

            await noteService.deleteNote('1', 'user1');

            expect(mockNoteRepository.findById).toHaveBeenCalledWith('1');
            expect(mockNoteRepository.delete).toHaveBeenCalledWith('1');
        });

        it('should throw an error if note is not found', async () => {
            mockNoteRepository.findById.mockResolvedValue(null);

            await expect(noteService.deleteNote('999', 'user1')).rejects.toThrow('Note not found');
            expect(mockNoteRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw an error if user is not the owner', async () => {
            const existingNote = { id: '1', title: 'Title', content: 'Content', userId: 'user1' };
            mockNoteRepository.findById.mockResolvedValue(existingNote);

            await expect(noteService.deleteNote('1', 'user2')).rejects.toThrow('Not authorized to delete this note');
            expect(mockNoteRepository.delete).not.toHaveBeenCalled();
        });
    });

  
});

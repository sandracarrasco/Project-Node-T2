import { jest } from '@jest/globals';
import AuthService from '../../../src/application/use-cases/auth.service.js';
import HashService from '../../../src/infrastructure/security/hash.service.js';
import JwtService from '../../../src/infrastructure/security/jwt.service.js';

describe('AuthService', () => {
    let authService;
    let mockUserRepository;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            save: jest.fn(),
        };
        authService = new AuthService(mockUserRepository);

        jest.spyOn(HashService, 'hash').mockImplementation();
        jest.spyOn(HashService, 'compare').mockImplementation();
        jest.spyOn(JwtService, 'generateToken').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = { email: 'test@example.com', password: 'password123', name: 'Test User' };
            mockUserRepository.findByEmail.mockResolvedValue(null);
            HashService.hash.mockResolvedValue('hashed_password');
            mockUserRepository.save.mockResolvedValue();

            const result = await authService.register(userData);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(HashService.hash).toHaveBeenCalledWith('password123');
            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(result).toEqual({ message: 'User registered successfully' });
        });

        it('should throw an error if email is already in use', async () => {
            const userData = { email: 'test@example.com', password: 'password123', name: 'Test User' };
            mockUserRepository.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });

            await expect(authService.register(userData)).rejects.toThrow('Email already in use');
            expect(HashService.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should login successfully and return a token', async () => {
            const credentials = { email: 'test@example.com', password: 'password123' };
            const mockUser = { id: '1', email: 'test@example.com', password: 'hashed_password', role: 'user' };
            
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            HashService.compare.mockResolvedValue(true);
            JwtService.generateToken.mockReturnValue('mocked_token');

            const result = await authService.login(credentials);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
            expect(HashService.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
            expect(JwtService.generateToken).toHaveBeenCalledWith({ id: mockUser.id, email: mockUser.email, role: mockUser.role });
            expect(result).toEqual({ token: 'mocked_token' });
        });

        it('should throw an error for invalid email', async () => {
            const credentials = { email: 'wrong@example.com', password: 'password123' };
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
        });

        it('should throw an error for invalid password', async () => {
            const credentials = { email: 'test@example.com', password: 'wrongpassword' };
            const mockUser = { id: '1', email: 'test@example.com', password: 'hashed_password', role: 'user' };
            
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            HashService.compare.mockResolvedValue(false);

            await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
        });
    });
});

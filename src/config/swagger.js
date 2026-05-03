import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notas API',
            version: '1.0.0',
            description: 'API RESTful para la gestión de notas',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingrese su token JWT con el formato: Bearer <token>'
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        id: { type: 'string', description: 'ID autogenerado del usuario' },
                        name: { type: 'string', description: 'Nombre del usuario' },
                        email: { type: 'string', description: 'Correo electrónico del usuario' },
                        password: { type: 'string', description: 'Contraseña encriptada' },
                        role: { type: 'string', enum: ['user', 'admin'], description: 'Rol del usuario' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Note: {
                    type: 'object',
                    required: ['title', 'content', 'userId'],
                    properties: {
                        id: { type: 'string', description: 'ID autogenerado de la nota' },
                        title: { type: 'string', description: 'Título de la nota' },
                        content: { type: 'string', description: 'Contenido detallado de la nota' },
                        imageUrl: { type: 'string', description: 'URL de la imagen adjunta', nullable: true },
                        userId: { type: 'string', description: 'ID del usuario creador de la nota' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'integer', description: 'Código de estado HTTP' },
                        message: { type: 'string', description: 'Mensaje de error descriptivo' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/presentation/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📄 Swagger docs available at http://localhost:3000/api-docs');
};

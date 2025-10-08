# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Sistema Universitario de Gestión Documental Digital!

## 📋 Índice
1. [Código de Conducta](#código-de-conducta)
2. [Cómo Contribuir](#cómo-contribuir)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Estándares de Código](#estándares-de-código)
5. [Proceso de Pull Request](#proceso-de-pull-request)
6. [Reporte de Bugs](#reporte-de-bugs)

## 📜 Código de Conducta

### Nuestros Compromisos
- Crear un ambiente inclusivo y acogedor
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable
- Uso de lenguaje o imágenes sexualizadas
- Comentarios despectivos o ataques personales
- Acoso público o privado
- Publicación de información privada sin permiso
- Cualquier conducta inapropiada en un entorno profesional

## 🚀 Cómo Contribuir

### Tipos de Contribuciones
- 🐛 **Bug Fixes**: Corrección de errores
- ✨ **Nuevas Funcionalidades**: Agregar características
- 📚 **Documentación**: Mejorar documentación
- 🧪 **Tests**: Agregar o mejorar pruebas
- 🔧 **Mejoras**: Optimizaciones de rendimiento
- 🎨 **UI/UX**: Mejoras en interfaz de usuario

### Antes de Contribuir
1. Revisa los [issues existentes](https://github.com/universidad/sistema-universitario/issues)
2. Verifica que no exista un trabajo similar en progreso
3. Asegúrate de entender el alcance del proyecto
4. Revisa la [documentación técnica](docs/)

## ⚙️ Configuración del Entorno

### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU_USUARIO/sistema-universitario.git
cd sistema-universitario/proyecto
```

### 2. Configurar Remote
```bash
# Agregar el repositorio original como upstream
git remote add upstream https://github.com/universidad/sistema-universitario.git

# Verificar configuración
git remote -v
```

### 3. Instalar Dependencias
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Base de datos (Docker)
cd ..
docker-compose -f docker/docker-compose.yml up -d postgres redis
```

### 4. Configurar Variables de Desarrollo
```bash
# Backend
cd backend
cp .env.example .env.development

# Frontend
cd ../frontend
cp .env.example .env.development
```

## 📝 Estándares de Código

### TypeScript
```typescript
// Usar interfaces para definir tipos
interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Usar tipos explícitos
const createStudent = (data: CreateStudentRequest): Promise<Student> => {
  // Implementación
};
```

### Nomenclatura
```typescript
// Variables y funciones: camelCase
const studentName = 'Juan Pérez';
const calculateGPA = (grades: number[]) => { /* ... */ };

// Constantes: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Interfaces y tipos: PascalCase
interface StudentService { /* ... */ }
type UserRole = 'admin' | 'teacher' | 'student';

// Archivos: kebab-case
// student-service.ts
// user-controller.ts
```

### Estructura de Archivos
```
src/
├── controllers/     # Controladores de rutas
├── services/       # Lógica de negocio
├── models/         # Modelos de datos
├── middleware/     # Middleware personalizado
├── utils/          # Utilidades
├── types/          # Definiciones de tipos
└── tests/          # Pruebas unitarias
```

### Comentarios
```typescript
/**
 * Crea un nuevo estudiante en el sistema
 * @param studentData - Datos del estudiante a crear
 * @returns Promise con el estudiante creado
 * @throws {ValidationError} Si los datos no son válidos
 * @throws {DatabaseError} Si hay error en la base de datos
 */
async function createStudent(studentData: CreateStudentRequest): Promise<Student> {
  // Validar datos de entrada
  await validateStudentData(studentData);
  
  // Crear estudiante en base de datos
  const student = await studentRepository.create(studentData);
  
  return student;
}
```

### Manejo de Errores
```typescript
// Usar clases de error personalizadas
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Manejo de errores en controladores
try {
  const result = await studentService.create(req.body);
  res.status(201).json(result);
} catch (error) {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message, field: error.field });
  } else {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
```

## 🧪 Testing

### Pruebas Unitarias
```typescript
// student.service.test.ts
describe('StudentService', () => {
  describe('createStudent', () => {
    it('should create a new student with valid data', async () => {
      const studentData = {
        name: 'Juan Pérez',
        email: 'juan@email.com'
      };
      
      const result = await studentService.create(studentData);
      
      expect(result).toBeDefined();
      expect(result.name).toBe(studentData.name);
      expect(result.email).toBe(studentData.email);
    });
    
    it('should throw ValidationError for invalid email', async () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'invalid-email'
      };
      
      await expect(studentService.create(invalidData))
        .rejects.toThrow(ValidationError);
    });
  });
});
```

### Pruebas de Integración
```typescript
// student.integration.test.ts
describe('Student API', () => {
  it('POST /api/students should create a new student', async () => {
    const response = await request(app)
      .post('/api/students')
      .send({
        name: 'Juan Pérez',
        email: 'juan@email.com'
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Juan Pérez');
  });
});
```

### Cobertura de Pruebas
```bash
# Ejecutar pruebas con cobertura
npm run test:coverage

# Cobertura mínima requerida: 80%
```

## 🔄 Proceso de Pull Request

### 1. Crear Branch
```bash
# Crear branch desde develop
git checkout develop
git pull upstream develop
git checkout -b feature/nueva-funcionalidad

# O para bug fixes
git checkout -b fix/correccion-bug
```

### 2. Desarrollo
```bash
# Hacer commits frecuentes
git add .
git commit -m "feat: agregar validación de email en registro"

# Mantener branch actualizado
git fetch upstream
git rebase upstream/develop
```

### 3. Convenciones de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato de código (sin cambios funcionales)
refactor: refactorización de código
test: agregar o corregir pruebas
chore: tareas de mantenimiento

# Ejemplos:
feat: agregar autenticación OAuth
fix: corregir validación de fecha de nacimiento
docs: actualizar guía de instalación
test: agregar pruebas para StudentService
```

### 4. Crear Pull Request
1. Ir a GitHub y crear Pull Request
2. Usar template de PR
3. Asignar reviewers
4. Agregar labels apropiados

### Template de Pull Request
```markdown
## 📋 Descripción
Breve descripción de los cambios realizados.

## 🔧 Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ✅ Checklist
- [ ] Código sigue los estándares del proyecto
- [ ] Pruebas agregadas o actualizadas
- [ ] Documentación actualizada
- [ ] No hay breaking changes
- [ ] Cobertura de pruebas > 80%

## 🧪 Cómo Probar
Instrucciones para probar los cambios.

## 📸 Screenshots (si aplica)
Capturas de pantalla de los cambios visuales.

## 📚 Referencias
Links a issues, documentación, etc.
```

### 5. Review Process
- Al menos 2 aprobaciones requeridas
- Todos los checks deben pasar
- Resolver comentarios del reviewer
- Mantener branch actualizado

## 🐛 Reporte de Bugs

### Template de Bug Report
```markdown
**Describe el bug**
Descripción clara y concisa del bug.

**Pasos para reproducir**
1. Ir a '...'
2. Hacer clic en '....'
3. Ver error

**Comportamiento esperado**
Qué esperabas que pasara.

**Screenshots**
Capturas de pantalla si aplica.

**Información del entorno**
- OS: [ej. Windows 10, macOS 11.0]
- Browser: [ej. Chrome 91, Firefox 89]
- Versión: [ej. 1.2.3]

**Información adicional**
Cualquier información adicional relevante.
```

### Severidad de Bugs
- **Crítico**: Sistema no funciona
- **Alto**: Funcionalidad principal afectada
- **Medio**: Funcionalidad secundaria afectada
- **Bajo**: Problemas menores o cosméticos

## 📚 Recursos Adicionales

### Documentación
- [Arquitectura del Sistema](docs/ARQUITECTURA.md)
- [API Documentation](docs/API.md)
- [Guía de Seguridad](docs/SEGURIDAD.md)
- [Normas y Estándares](docs/NORMAS.md)

### Herramientas
- [ESLint](https://eslint.org/) - Linter de JavaScript/TypeScript
- [Prettier](https://prettier.io/) - Formateador de código
- [Jest](https://jestjs.io/) - Framework de testing
- [Husky](https://typicode.github.io/husky/) - Git hooks

### Comunidad
- [Discord](https://discord.gg/universidad) - Chat de la comunidad
- [GitHub Discussions](https://github.com/universidad/sistema-universitario/discussions)
- [Email](contribuciones@universidad.edu.mx) - Contacto directo

## 🎉 Reconocimientos

Los contribuidores serán reconocidos en:
- README del proyecto
- Release notes
- Documentación de agradecimientos
- Eventos de la comunidad

---

¡Gracias por contribuir al proyecto! Tu ayuda hace posible que este sistema beneficie a miles de estudiantes y personal universitario. 🚀

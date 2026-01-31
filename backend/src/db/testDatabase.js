import { runMigrations } from './migrations.js';
import { User } from '../models/User.js';
import { Resume } from '../models/Resume.js';
import { PDF } from '../models/PDF.js';

console.log('🧪 Iniciando pruebas de base de datos...\n');

// Ejecutar migraciones
runMigrations();

try {
  // Prueba 1: Crear usuario
  console.log('📝 Prueba 1: Crear usuario de prueba');
  const user = User.findOrCreate({
    google_id: 'test_123',
    email: 'test@example.com',
    name: 'Usuario de Prueba',
    picture: 'https://example.com/avatar.jpg'
  });
  console.log('✅ Usuario creado:', user);

  // Prueba 2: Crear currículum
  console.log('\n📝 Prueba 2: Crear currículum de prueba');
  const resume = Resume.create({
    user_id: user.id,
    title: 'Mi Primer Currículum',
    data: {
      personalInfo: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '+34 123 456 789'
      },
      experience: [],
      education: [],
      skills: []
    },
    template: 'modern'
  });
  console.log('✅ Currículum creado:', {
    id: resume.id,
    title: resume.title,
    template: resume.template
  });

  // Prueba 3: Listar currículums del usuario
  console.log('\n📝 Prueba 3: Listar currículums del usuario');
  const resumes = Resume.findByUserId(user.id);
  console.log(`✅ Total de currículums: ${resumes.length}`);

  // Prueba 4: Actualizar currículum
  console.log('\n📝 Prueba 4: Actualizar currículum');
  const updatedResume = Resume.update(resume.id, {
    title: 'Currículum Actualizado'
  });
  console.log('✅ Currículum actualizado:', {
    id: updatedResume.id,
    title: updatedResume.title
  });

  // Prueba 5: Crear PDF (simulado con texto en vez de blob real)
  console.log('\n📝 Prueba 5: Crear PDF de prueba');
  const pdfData = Buffer.from('Este es un PDF de prueba');
  const pdf = PDF.create({
    resume_id: resume.id,
    user_id: user.id,
    filename: 'curriculum-juan-perez.pdf',
    pdf_data: pdfData,
    file_size: pdfData.length
  });
  console.log('✅ PDF creado:', {
    id: pdf.id,
    filename: pdf.filename,
    file_size: pdf.file_size
  });

  // Prueba 6: Listar PDFs del currículum
  console.log('\n📝 Prueba 6: Listar PDFs del currículum');
  const pdfs = PDF.findByResumeAndUser(resume.id, user.id);
  console.log(`✅ Total de PDFs: ${pdfs.length}`);

  // Prueba 7: Estadísticas
  console.log('\n📊 Estadísticas de la base de datos:');
  console.log(`- Total usuarios: ${User.count()}`);
  console.log(`- Total currículums: ${Resume.count()}`);
  console.log(`- Total PDFs: ${PDF.count()}`);

  console.log('\n✅ ¡Todas las pruebas pasaron exitosamente!\n');
  console.log('⚠️  Nota: Este es un script de prueba. Los datos se guardan en la base de datos.');
  console.log('   Para limpiar los datos de prueba, puedes eliminar el archivo curriculai.db\n');

} catch (error) {
  console.error('\n❌ Error en las pruebas:', error);
  process.exit(1);
}

import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * POST /api/ai/improve-experience
 * Transform job descriptions into high-impact achievement bullet points
 */
router.post('/improve-experience', async (req, res) => {
  try {
    const { description, context } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        error: 'Se requiere una descripción para mejorar'
      });
    }

    // Build context string for the AI
    const contextInfo = context ? `
Contexto del puesto:
- Puesto: ${context.position || 'No especificado'}
- Empresa: ${context.company || 'No especificada'}
- Período: ${context.startDate || ''} - ${context.current ? 'Presente' : (context.endDate || '')}
` : '';

    const systemPrompt = `Eres un experto en recursos humanos y redacción de currículums profesionales. Tu tarea es transformar descripciones simples de trabajo en logros de alto impacto que impresionen a los reclutadores.

REGLAS IMPORTANTES:
1. Transforma cada punto en un logro cuantificable usando el formato STAR (Situación, Tarea, Acción, Resultado)
2. SIEMPRE incluye métricas específicas (porcentajes, números, tiempos, dinero) - si no se proporcionan, infiere métricas realistas basadas en el contexto
3. Usa verbos de acción poderosos al inicio de cada bullet point (Optimicé, Lideré, Implementé, Desarrollé, Reduje, Aumenté, etc.)
4. Mantén cada bullet point conciso (1-2 líneas máximo)
5. Enfócate en el IMPACTO y RESULTADOS, no solo en las responsabilidades
6. Responde SOLO con los bullet points, sin explicaciones adicionales
7. Cada bullet point debe empezar con "• "
8. Responde en español

EJEMPLOS DE TRANSFORMACIÓN:
- "arreglé bugs" → "• Optimicé el rendimiento del sistema resolviendo 15+ bugs críticos, reduciendo el tiempo de carga en un 40% y mejorando la satisfacción del usuario"
- "hice la página web" → "• Desarrollé una aplicación web responsive utilizando React y Node.js, logrando 10,000+ usuarios activos mensuales y una tasa de conversión del 25%"
- "atendí clientes" → "• Gestioné una cartera de 50+ clientes clave, aumentando la retención en un 35% y generando $200K en renovaciones anuales"
- "manejé el equipo" → "• Lideré un equipo multifuncional de 8 personas, entregando 12 proyectos dentro del plazo y presupuesto, mejorando la productividad del equipo en un 30%"`;

    const userPrompt = `${contextInfo}

Descripción original del trabajo:
${description}

Transforma esta descripción en 3-5 bullet points de alto impacto con métricas cuantificables:`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024
    });

    const improved = completion.choices[0]?.message?.content?.trim();

    if (!improved) {
      throw new Error('No se pudo generar la mejora');
    }

    res.json({ improved });
  } catch (error) {
    console.error('Error al mejorar experiencia con IA:', error);
    res.status(500).json({
      error: 'Error al procesar con IA',
      message: error.message
    });
  }
});

/**
 * POST /api/ai/generate-summary
 * Generate a professional summary based on resume data
 */
router.post('/generate-summary', async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        error: 'Se requieren datos del currículum'
      });
    }

    const { personalInfo, experiences, education, skills } = resumeData;

    // Build context from resume data
    let experienceContext = '';
    if (experiences && experiences.length > 0) {
      experienceContext = experiences.map(exp =>
        `- ${exp.position} en ${exp.company}`
      ).join('\n');
    }

    let skillsContext = '';
    if (skills && skills.length > 0) {
      skillsContext = skills.flatMap(cat => cat.skills || []).slice(0, 10).join(', ');
    }

    let educationContext = '';
    if (education && education.length > 0) {
      educationContext = education.map(edu =>
        `- ${edu.degree} en ${edu.field} - ${edu.institution}`
      ).join('\n');
    }

    const systemPrompt = `Eres un experto en recursos humanos especializado en redactar resúmenes profesionales para currículums.

REGLAS:
1. Escribe un resumen profesional conciso de 2-3 oraciones (máximo 300 caracteres)
2. Destaca años de experiencia, especialización principal y valor único
3. Usa un tono profesional pero dinámico
4. Incluye palabras clave relevantes para ATS
5. Responde SOLO con el resumen, sin explicaciones
6. Responde en español`;

    const userPrompt = `Genera un resumen profesional basado en:

${experienceContext ? `EXPERIENCIA:\n${experienceContext}` : ''}
${skillsContext ? `\nHABILIDADES: ${skillsContext}` : ''}
${educationContext ? `\nEDUCACIÓN:\n${educationContext}` : ''}

Resumen profesional:`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 512
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error('No se pudo generar el resumen');
    }

    res.json({ summary });
  } catch (error) {
    console.error('Error al generar resumen con IA:', error);
    res.status(500).json({
      error: 'Error al procesar con IA',
      message: error.message
    });
  }
});

/**
 * POST /api/ai/improve-summary
 * Improve an existing professional summary
 */
router.post('/improve-summary', async (req, res) => {
  try {
    const { summary, resumeData } = req.body;

    if (!summary || !summary.trim()) {
      return res.status(400).json({
        error: 'Se requiere un resumen para mejorar'
      });
    }

    const systemPrompt = `Eres un experto en recursos humanos. Mejora el resumen profesional proporcionado para hacerlo más impactante y profesional.

REGLAS:
1. Mantén la esencia del mensaje original
2. Hazlo más conciso y poderoso (máximo 300 caracteres)
3. Usa verbos de acción y palabras de impacto
4. Incluye palabras clave relevantes para sistemas ATS
5. Responde SOLO con el resumen mejorado, sin explicaciones
6. Responde en español`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Mejora este resumen profesional:\n\n${summary}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 512
    });

    const improved = completion.choices[0]?.message?.content?.trim();

    if (!improved) {
      throw new Error('No se pudo mejorar el resumen');
    }

    res.json({ improved });
  } catch (error) {
    console.error('Error al mejorar resumen con IA:', error);
    res.status(500).json({
      error: 'Error al procesar con IA',
      message: error.message
    });
  }
});

/**
 * POST /api/ai/translate-resume
 * Translate resume content to a target language using AI
 */
router.post('/translate-resume', async (req, res) => {
  try {
    const { resumeData, targetLanguage } = req.body;

    if (!resumeData || !targetLanguage) {
      return res.status(400).json({
        error: 'Se requieren datos del currículum e idioma destino'
      });
    }

    // Extract only translatable fields to reduce token usage
    const translatableData = {};

    if (resumeData.personalInfo?.location) {
      translatableData.personalInfo = { location: resumeData.personalInfo.location };
    }

    if (resumeData.experience?.length > 0) {
      translatableData.experience = resumeData.experience.map(exp => ({
        position: exp.position || '',
        description: exp.description || ''
      }));
    }

    if (resumeData.education?.length > 0) {
      translatableData.education = resumeData.education.map(edu => ({
        degree: edu.degree || '',
        field: edu.field || '',
        description: edu.description || ''
      }));
    }

    if (resumeData.skills?.length > 0) {
      translatableData.skills = resumeData.skills.map(group => ({
        category: group.category || '',
        skills: group.skills || []
      }));
    }

    if (resumeData.summary) {
      translatableData.summary = resumeData.summary;
    }

    if (resumeData.additionalSections?.length > 0) {
      translatableData.additionalSections = resumeData.additionalSections.map(section => ({
        type: section.type,
        items: section.items?.map(item => {
          const translated = {};
          for (const [key, value] of Object.entries(item)) {
            if (key === 'id' || key === 'instanceId') continue;
            if (typeof value === 'string') translated[key] = value;
          }
          return translated;
        }) || []
      }));
    }

    const LANGUAGE_NAMES = {
      en: 'English', fr: 'French', de: 'German', pt: 'Portuguese',
      it: 'Italian', nl: 'Dutch', zh: 'Chinese (Simplified)',
      ja: 'Japanese', ko: 'Korean'
    };

    const langName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

    const systemPrompt = `You are an expert CV/resume translator. Translate the resume content from Spanish to ${langName}.

RULES:
- Translate: job titles, descriptions, degree names, study fields, skill category names (e.g. "Técnicas" → "Technical"), professional summary, location names
- Do NOT translate: personal names, company names, institution names, email addresses, phone numbers, URLs, dates
- For technical skills (React, Node.js, Python, AWS, etc.): keep them as-is, do NOT translate
- For soft skills or non-technical skills: translate them (e.g. "Liderazgo" → "Leadership")
- Keep bullet point format (• ) exactly as-is
- Maintain professional tone appropriate for the ${langName} job market
- Return ONLY valid JSON matching the exact input structure, no markdown formatting, no code blocks
- Do not add any text before or after the JSON`;

    const userPrompt = `Translate the following resume data to ${langName}:\n\n${JSON.stringify(translatableData, null, 2)}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 4096
    });

    const rawResponse = completion.choices[0]?.message?.content?.trim();

    if (!rawResponse) {
      throw new Error('No se pudo generar la traducción');
    }

    // Parse the JSON response, handling potential markdown code blocks
    let translation;
    try {
      const jsonStr = rawResponse.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      translation = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI translation response:', rawResponse);
      throw new Error('La respuesta de IA no es JSON válido');
    }

    res.json({ translation });
  } catch (error) {
    console.error('Error al traducir currículum con IA:', error);
    res.status(500).json({
      error: 'Error al traducir con IA',
      message: error.message
    });
  }
});

export default router;

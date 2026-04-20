import Groq from 'groq-sdk';

const generatePetDescription = async (req, res) => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const { name, specie, birthDate } = req.body;
    if (!name || !specie) return res.status(400).send({ status: "error", error: "Incomplete values" });

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Escribí una descripción atractiva y emotiva para una mascota en adopción con estos datos:
                Nombre: ${name}
                Especie: ${specie}
                Fecha de nacimiento: ${birthDate || 'desconocida'}
                La descripción debe ser en español, tener 3 oraciones y motivar a la gente a adoptarla.`
            }
        ],
        model: "llama-3.3-70b-versatile",
    });

    const description = completion.choices[0]?.message?.content || "";
    res.send({ status: "success", payload: description });
}

const chat = async (req, res) => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const { messages, pets } = req.body;
    if (!messages) return res.status(400).send({ status: "error", error: "Incomplete values" });

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Sos un asistente de adopción de mascotas llamado AdoptBot. 
                Ayudás a las personas a encontrar su mascota ideal y das consejos sobre adopción y cuidado.
                Las mascotas disponibles actualmente son: ${JSON.stringify(pets)}.
                Respondé siempre en español, de forma amigable y concisa, respuestas cortas .`
            },
            ...messages
        ],
        model: "llama-3.3-70b-versatile",
    });

    const response = completion.choices[0]?.message?.content || "";
    res.send({ status: "success", payload: response });
}

const generateAdoptionQuestions = async (req, res) => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { name, specie } = req.body;
    if (!name || !specie) return res.status(400).send({ status: "error", error: "Incomplete values" });

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Generá 6 preguntas para evaluar si una persona es apta para adoptar una mascota.
                La mascota es: ${name}, especie: ${specie}.
                Las preguntas deben ser sobre: tipo de vivienda, espacios disponibles, redes de contención, compromiso de castración, experiencia previa con mascotas.
                Adaptá las preguntas según la especie. Si la persona no es apta dicelo
                Respondé SOLO con un array JSON con este formato, sin texto extra:
                [
                  {"id": 1, "pregunta": "..."},
                  {"id": 2, "pregunta": "..."}
                ]`
            }
        ],
        model: "llama-3.3-70b-versatile",
    });

    try {
        const text = completion.choices[0]?.message?.content || "[]"
        const questions = JSON.parse(text)
        res.send({ status: "success", payload: questions })
    } catch (e) {
        res.status(500).send({ status: "error", error: "Error al generar preguntas" })
    }
}

const evaluateAdoption = async (req, res) => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { name, specie, answers } = req.body;
    if (!name || !specie || !answers) return res.status(400).send({ status: "error", error: "Incomplete values" });

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Evaluá si esta persona es apta para adoptar a ${name} (${specie}).
                Sus respuestas fueron: ${JSON.stringify(answers)}
                Respondé SOLO con un objeto JSON con este formato, sin texto extra:
                {
                  "apto": true o false,
                  "mensaje": "explicación breve y empática de máximo 3 oraciones"
                }`
            }
        ],
        model: "llama-3.3-70b-versatile",
    });

    try {
        const text = completion.choices[0]?.message?.content || "{}"
        const result = JSON.parse(text)
        res.send({ status: "success", payload: result })
    } catch (e) {
        res.status(500).send({ status: "error", error: "Error al evaluar" })
    }
}


export default { generatePetDescription, chat, generateAdoptionQuestions, evaluateAdoption}
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



export default { generatePetDescription, chat}
exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `Você é o Entre, um assistente virtual de pré-consulta do projeto "Dor não deveria ser normal". Seu papel é ajudar a pessoa a organizar seus sintomas, dúvidas e histórico antes de uma consulta médica sobre endometriose ou dor pélvica crônica.

Regras que você deve seguir sempre:
- Nunca faça diagnósticos. Nunca sugira que a pessoa tem ou não tem endometriose.
- Nunca substitua orientação médica profissional.
- Use linguagem inclusiva e neutra em termos de gênero. Evite usar "mulher", "menstruação", "útero" como marcadores de identidade — prefira "ciclo", "período", "dor pélvica", "corpo".
- Seja acolhedor, direto e humano. Sem jargão clínico desnecessário.
- Faça perguntas curtas, uma por vez, para ajudar a pessoa a detalhar: quando a dor aparece, com que frequência, intensidade, o que melhora ou piora, há quanto tempo convive com isso, quais médicos já consultou.
- Ao final da conversa (quando a pessoa sinalizar que terminou ou após 6 a 8 trocas), ofereça um resumo organizado dos sintomas relatados, em formato de lista simples, para a pessoa levar à consulta.
- Se a pessoa demonstrar sofrimento emocional intenso, acolha com empatia e sugira apoio psicológico além do médico.
- Responda sempre em português brasileiro.`,
        messages
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: data.content?.[0]?.text || '' })
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

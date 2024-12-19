export  async function POST(req, res) {
    const apiKey=process.env.apiKey;
    if (req.method === 'POST') {
      const { messages } = req.body;
  
      try {
      
        const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=apiKey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.apiKey}`, 
          },
          body: JSON.stringify({
            messages, 
          }),
        });
  
        if (!geminiResponse.ok) {
          const errorData = await geminiResponse.json();
          throw new Error(`Gemini API error: ${errorData.message || geminiResponse.statusText}`);
        }
  
        const geminiResult = await geminiResponse.json();
        return new Response(JSON.stringify({ data: geminiResult.recognizedItem || "false" }),{status:200});
      } catch (error) {
        console.error("Error from Gemini API:", error);
        return new Response(JSON.stringify({ message: "Failed to recognize the image"}),{ error: error.message });
      }
    } else {
    
        
        return new Response('Method PUT Not Allowed', { status: 405 });
    }
  }
  
// SachiDev - General Purpose Chatbot with Video Database Integration
// Features: Database access, Internet search, General knowledge, Video recommendations

class SachiDevChatbot {
  constructor() {
    this.apiKey = 'AIzaSyDY5VgoB8_Rvlmna0xPfiRow3FD2VrheQw';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    this.conversationHistory = [];
    this.isTyping = false;
    this.db = null; // Will be initialized with database connection
  }

  // Initialize database connection
  async initDatabase(supabaseClient) {
    this.db = supabaseClient;
  }

  // Main chat function
  async chat(message, context = {}) {
    try {
      this.isTyping = true;

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Determine if we need to search the database or internet
      const needsDatabaseSearch = this.shouldSearchDatabase(message);
      const needsInternetSearch = this.shouldSearchInternet(message);

      let contextData = '';

      // Search database if needed
      if (needsDatabaseSearch && this.db) {
        const dbResults = await this.searchDatabase(message);
        contextData += `\n\nDatabase Context:\n${dbResults}`;
      }

      // Search internet if needed
      if (needsInternetSearch) {
        const internetResults = await this.searchInternet(message);
        contextData += `\n\nInternet Context:\n${internetResults}`;
      }

      // Generate response using Gemini
      const response = await this.generateResponse(message, contextData, context);

      // Add bot response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });

      this.isTyping = false;
      return response;

    } catch (error) {
      console.error('Chatbot error:', error);
      this.isTyping = false;
      return "I'm sorry, I encountered an error. Please try again or rephrase your question.";
    }
  }

  // Determine if we should search the database
  shouldSearchDatabase(message) {
    const dbKeywords = [
      'video', 'videos', 'course', 'tutorial', 'lesson', 'learn', 'education',
      'show', 'find', 'search', 'recommend', 'suggest', 'watch', 'view',
      'programming', 'code', 'javascript', 'python', 'react', 'node', 'web',
      'math', 'mathematics', 'algebra', 'calculus', 'geometry', 'statistics',
      'science', 'physics', 'chemistry', 'biology', 'history', 'language',
      'saved', 'bookmark', 'favorite', 'popular', 'trending', 'new'
    ];

    return dbKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  // Determine if we should search the internet
  shouldSearchInternet(message) {
    const internetKeywords = [
      'latest', 'recent', 'news', 'update', 'current', 'today', 'now',
      'what is', 'how to', 'explain', 'definition', 'meaning',
      'formula', 'equation', 'theorem', 'proof', 'example'
    ];

    return internetKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  // Search database for relevant content
  async searchDatabase(query) {
    try {
      if (!this.db) return '';

      const { data, error } = await this.db
        .from('EduVideoDB')
        .select('*')
        .or(`title.ilike.%${query}%, description.ilike.%${query}%, category.ilike.%${query}%, ai_tags.cs.{${query}}`)
        .limit(8);

      if (error) throw error;

      if (!data || data.length === 0) {
        return 'No relevant videos found in our database.';
      }

      let results = '🎥 **Relevant Videos from Our Database:**\n\n';
      data.forEach((video, index) => {
        const videoLink = video.youtubeLink || video.videoUrl || '#';
        results += `**${index + 1}. [${video.title}](${videoLink})**\n`;
        results += `📚 Category: ${video.category}\n`;
        results += `⏱️ Duration: ${video.duration}\n`;
        results += `👀 Views: ${video.views}\n`;
        results += `⭐ Rating: ${video.rating ? video.rating.toFixed(1) : 'N/A'}\n`;
        results += `📝 ${video.description.substring(0, 120)}...\n\n`;
      });

      return results;
    } catch (error) {
      console.error('Database search error:', error);
      return 'Error searching database.';
    }
  }

  // Search internet for current information
  async searchInternet(query) {
    try {
      // For now, we'll simulate internet search with math-related responses
      // In a real implementation, you would use a search API like Google Custom Search
      const mathTopics = {
        'algebra': 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols.',
        'calculus': 'Calculus is the mathematical study of continuous change, in the same way that geometry is the study of shape.',
        'geometry': 'Geometry is a branch of mathematics concerned with questions of shape, size, relative position of figures, and the properties of space.',
        'statistics': 'Statistics is the discipline that concerns the collection, organization, analysis, interpretation, and presentation of data.',
        'trigonometry': 'Trigonometry is a branch of mathematics that studies relationships between side lengths and angles of triangles.'
      };

      const lowerQuery = query.toLowerCase();
      for (const [topic, description] of Object.entries(mathTopics)) {
        if (lowerQuery.includes(topic)) {
          return `Current information about ${topic}: ${description}`;
        }
      }

      return 'No specific current information found, but I can help with general math concepts.';
    } catch (error) {
      console.error('Internet search error:', error);
      return 'Error searching internet.';
    }
  }

  // Generate response using Gemini API
  async generateResponse(message, contextData, userContext) {
    try {
      const systemPrompt = `You are SachiDev, a helpful and knowledgeable AI assistant for an educational video platform. 

Your personality:
- Friendly, professional, and approachable
- Enthusiastic about learning and education
- Helpful and resourceful
- Clear and concise in explanations
- Encouraging and supportive

Your capabilities:
- Answer any general knowledge questions (like ChatGPT)
- Help users find relevant educational videos
- Provide explanations on any topic
- Suggest learning resources and strategies
- Help with homework, projects, and assignments
- Answer questions about technology, science, arts, business, etc.
- Provide step-by-step solutions to problems

When users ask about videos or learning content:
- Always search the database first if relevant
- Provide direct links to videos when available
- Suggest multiple relevant videos
- Include video details like duration, rating, and description

Always maintain a helpful, professional tone. If you reference videos, make sure to provide clickable links and relevant details.

${contextData ? `Additional Context: ${contextData}` : ''}

Current conversation history:
${this.conversationHistory.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;

      const requestBody = {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}\n\nSachiDev:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from API');
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  // Get conversation history
  getHistory() {
    return this.conversationHistory;
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Check if bot is currently typing
  isCurrentlyTyping() {
    return this.isTyping;
  }

  // Get general knowledge suggestions
  getGeneralSuggestions() {
    return [
      "What is artificial intelligence?",
      "How does photosynthesis work?",
      "Explain quantum computing",
      "What are the benefits of exercise?",
      "How to learn programming?",
      "What is climate change?",
      "Explain machine learning",
      "How to improve productivity?",
      "What is blockchain technology?",
      "How to manage stress?"
    ];
  }

  // Get video-related suggestions
  getVideoSuggestions() {
    return [
      "Show me programming tutorials",
      "Find math videos for beginners",
      "Recommend science documentaries",
      "What coding courses do you have?",
      "Show me business videos",
      "Find language learning content",
      "What's trending in education?",
      "Show me technology videos",
      "Find history documentaries",
      "Recommend skill development videos"
    ];
  }
}

// Export the chatbot class
export default SachiDevChatbot;

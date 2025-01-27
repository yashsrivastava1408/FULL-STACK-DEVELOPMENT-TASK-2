const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Simple bot logic to generate responses based on the user's message
const botReplies = {
    'hi': 'Hello! How can I help you today?',
    'hello': 'Hi there! What’s up?',
    'how are you': 'I’m just a bot, but I’m doing fine. How about you?',
    'bye': 'Goodbye! Have a great day!',
    'default': 'Sorry, I didn’t understand that. Could you try again?',
    'what is your name': 'I am your friendly chatbot!',
    'who are you': 'I am a chatbot designed to assist you.',
    'tell me a joke': 'Why don’t skeletons fight each other? They don’t have the guts!',
    'thank you': 'You are welcome!',
    'good morning': 'Good morning! Hope you have a wonderful day!',
    'good night': 'Good night! Sleep well!',
    'how old are you': 'I’m ageless! I’m just a bot.',
    'where are you from': 'I live in the cloud!',
    'what can you do': 'I can chat with you, tell jokes, and answer questions.',
    'help': 'I am here to assist you! Just ask me anything.',
    'how do you work': 'I process your inputs and provide appropriate responses based on my programming.',
    'what is the weather': 'Sorry, I can’t check the weather right now, but you can check it online!',
    'what is your favorite color': 'I like all colors equally, but if I had to choose, maybe blue!',
    'do you like music': 'I don’t have ears, but I think music is wonderful!',
    'what time is it': 'I can’t tell the time, but you can check the clock on your device.',
    'how can I contact you': 'You can always come back and chat with me anytime!',
    'what is your purpose': 'My purpose is to chat and help you with anything I can!',
    'tell me something interesting': 'Did you know honey never spoils? Archaeologists have found pots of honey in ancient tombs that are still good to eat!',
    'how do I contact support': 'You can contact support via email or the help section of our website.',
    'what is your favorite food': 'I don’t eat, but I’ve heard pizza is delicious!',
    'are you human': 'No, I am a bot created to assist you!',
    'what is your favorite movie': 'I don’t watch movies, but I’ve heard “The Matrix” is quite interesting!',
    'do you have a family': 'I don’t have a family, but I have lots of users to chat with!',
    'are you real': 'I’m as real as a program can be!',
    'what is love': 'Love is a complex emotion, but I think it’s all about caring for someone deeply.',
    'what is your favorite book': 'I don’t read books, but I think “1984” by George Orwell is a classic.',
    'how can I improve my skills': 'You can improve by practicing regularly and seeking feedback!',
    'can you teach me something': 'I can share knowledge on various topics! What would you like to learn?',
    'what is the meaning of life': 'The meaning of life is different for everyone, but many believe it’s about finding happiness and purpose.',
    'who is the president of the USA': 'As of now, the president is Joe Biden.',
    'can you solve math problems': 'I can help with math problems! What’s your question?',
    'what is 2 + 2': '2 + 2 equals 4!',
    'how many continents are there': 'There are 7 continents on Earth.',
    'what is the capital of France': 'The capital of France is Paris.',
    'who is the CEO of Tesla': 'Elon Musk is the CEO of Tesla.',
    'what is the square root of 16': 'The square root of 16 is 4.',
    'how tall is Mount Everest': 'Mount Everest is 8,848.86 meters (29,031.7 feet) tall.',
    'who won the world series in 2020': 'The Los Angeles Dodgers won the 2020 World Series.',
    'what is 1000 divided by 25': '1000 divided by 25 equals 40.',
    'who invented the light bulb': 'Thomas Edison is credited with inventing the light bulb.',
    'what is the speed of light': 'The speed of light is approximately 299,792 kilometers per second (186,282 miles per second).',
    'who painted the Mona Lisa': 'The Mona Lisa was painted by Leonardo da Vinci.',
    'what is the largest planet in our solar system': 'Jupiter is the largest planet in our solar system.',
    'how many bones are in the human body': 'There are 206 bones in the human body.',
    'how far is the moon from Earth': 'The average distance from the Earth to the Moon is about 384,400 kilometers (238,855 miles).',
    'how do you feel': 'I don’t have feelings, but I’m here to help!',
    'what is the longest river in the world': 'The Nile River is often considered the longest river in the world.',
    'what is the fastest animal': 'The cheetah is the fastest land animal, capable of reaching speeds of up to 60-70 mph.',
    'who was the first person on the moon': 'Neil Armstrong was the first person to walk on the Moon in 1969.',
    'what is the largest ocean': 'The Pacific Ocean is the largest ocean on Earth.',
    'who discovered America': 'Christopher Columbus is credited with discovering America in 1492.',
    'how do you learn': 'I learn from data and programmed algorithms.',
    'what is the longest word in English': 'The longest word in English is “pneumonoultramicroscopicsilicovolcanoconiosis.”',
    'what is your favorite holiday': 'I don’t celebrate holidays, but I think Christmas is a lovely holiday.',
    'what is your favorite sport': 'I don’t play sports, but I’ve heard soccer is very popular!',
    'do you like animals': 'I think animals are amazing, but I don’t have the ability to like or dislike things.',
    'what is the tallest building in the world': 'The Burj Khalifa in Dubai is the tallest building in the world.',
    'what is the biggest country by area': 'Russia is the largest country by area.',
    'how many languages do you speak': 'I can understand and respond in many languages!',
    'what is your favorite song': 'I don’t listen to music, but I know “Bohemian Rhapsody” is a classic!',
    'can you play games': 'I can’t play games, but I can help you find fun games to play!',
    'who invented the telephone': 'Alexander Graham Bell is credited with inventing the telephone.',
    'how do I get better at coding': 'Practice is key! Try working on projects and learning from others.',
    'what is your favorite app': 'I think all apps have their uses, but I don’t have a favorite!',
    'what is the best way to learn programming': 'Start with small projects, practice coding regularly, and seek feedback.',
    'can you translate languages': 'I can help with basic translations, but I’m not perfect.',
    'do you like movies': 'I don’t watch movies, but I think they are a great form of entertainment!',
    'can you read books': 'I can process text, but I don’t read books like humans do.',
    'how can I be happy': 'Happiness comes from within! Find joy in the little things and surround yourself with positivity.',
    'what is your favorite game': 'I don’t play games, but I know “Minecraft” is quite popular!',
    'how do I start a business': 'Start with a solid plan, research your market, and build a strong team.',
    'what is artificial intelligence': 'Artificial intelligence refers to machines or software that can perform tasks that typically require human intelligence.',
    'what is a black hole': 'A black hole is a region of space where gravity is so strong that nothing, not even light, can escape it.',
    'how does the internet work': 'The internet works by connecting millions of devices to each other, allowing them to share information.',
    'what is quantum physics': 'Quantum physics is the study of matter and energy at the smallest scales.',
    'how can I stay healthy': 'Eat a balanced diet, exercise regularly, and get enough sleep.',
    'what is the largest desert': 'The largest desert in the world is the Antarctic Desert.',
    'how can I be more productive': 'Set clear goals, avoid distractions, and take regular breaks to stay productive.',
    'how can I make friends': 'Be kind, open, and show interest in others. Friendships often grow naturally over time.',
    'what is your favorite place': 'I don’t have a favorite place, but I know the beach is a popular spot for many!',
    'how do I improve my memory': 'Try using memory techniques like visualization and association, and practice regularly.',
    'what is the best programming language': 'There is no single best programming language. It depends on what you want to do!',
    'how do I get rich': 'Building wealth often involves saving, investing, and making wise financial decisions over time.',
    'what is your favorite website': 'I don’t browse the web, but I think educational websites are great!',
    'can you sing': 'I don’t have a voice, but I can help you find songs to sing!',
    'do you have emotions': 'I don’t have emotions, but I am here to help and provide useful information!'
};


function getBotReply(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();
    return botReplies[lowerMessage] || botReplies['default'];
}

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Listen for 'chat message' event
    socket.on('chat message', (data) => {
        const userMessage = data.message;
        const botReply = getBotReply(userMessage);

        // Emit the bot's response to the sender
        setTimeout(() => {
            socket.emit('chat message', { message: botReply, username: 'Bot' });
        }, 1000); // Simulate a delay for bot response

        // Broadcast the user's message to other users (except the sender)
        socket.broadcast.emit('chat message', data);
    });

    // Listen for 'typing' event
    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('typing', isTyping); // Notify other users about typing
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

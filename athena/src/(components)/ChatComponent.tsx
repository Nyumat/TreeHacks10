import React from 'react';

interface MessageProps {
    isBot: boolean;
    content: string;
}

const Message: React.FC<MessageProps> = ({ isBot, content }) => {
    return (
        <div style={{ textAlign: isBot ? 'left' : 'right' }}>
            <div style={{ display: 'inline-block', backgroundColor: isBot ? '#f0f0f0' : '#007bff', color: isBot ? '#000' : '#fff', padding: '5px 10px', borderRadius: '10px', maxWidth: '70%', wordWrap: 'break-word' }}>
                {content}
            </div>
        </div>
    );
};

export default Message;

import React from 'react';

export default function CodeCopyButton({ code } : {code: string}) {
  const [buttonText, setButtonText] = React.useState('Copy code');
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setButtonText('Copied!');
  };

  return (
    <button onClick={handleCopyClick}>
      {isCopied ? 'Copied!' : buttonText}
    </button>
  );
}
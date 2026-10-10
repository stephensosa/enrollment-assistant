const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
const characterCount = document.getElementById('character-count');

function appendMessage(text, className) {
  const article = document.createElement('article');
  article.className = `message ${className}`;
  const copy = document.createElement('div');
  copy.className = 'message-copy';
  copy.textContent = text;
  article.append(copy);
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
  return article;
}

function attachFeedback(article, response) {
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  const references = document.createElement('span');
  references.className = 'faq-reference';
  references.textContent = response.matched_faq_ids.length
    ? `FAQ · ${response.matched_faq_ids.join(' · ')}`
    : 'FAQ · none';
  meta.append(references);

  const actions = document.createElement('span');
  actions.className = 'feedback-actions';
  const status = document.createElement('span');
  status.className = 'feedback-status';
  status.setAttribute('aria-live', 'polite');
  for (const [rating, label, icon] of [['up', 'Helpful', '👍'], ['down', 'Not helpful', '👎']]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'feedback-button';
    button.textContent = icon;
    button.dataset.rating = rating;
    button.title = label;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const result = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request_id: response.request_id, rating }),
        });
        if (!result.ok) throw new Error('Feedback was not saved');
        actions.querySelectorAll('button').forEach((item) => {
          item.disabled = false;
          item.setAttribute('aria-pressed', String(item === button));
        });
        status.textContent = 'Thanks for your feedback';
      } catch {
        button.disabled = false;
        status.textContent = 'Could not save rating';
      }
    });
    actions.append(button);
  }
  actions.append(status);
  meta.append(actions);
  article.append(meta);
}

input.addEventListener('input', () => {
  characterCount.textContent = input.value.length;
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message || message.length > 500 || sendButton.disabled) return;

  appendMessage(message, 'user-message');
  input.value = '';
  characterCount.textContent = '0';
  input.style.height = 'auto';
  input.disabled = true;
  sendButton.disabled = true;
  const loading = appendMessage('Finding an answer', 'assistant-message loading-message');
  loading.querySelector('.message-copy').classList.add('loading-dots');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'The message could not be sent.');
    loading.remove();
    const answer = appendMessage(payload.answer, 'assistant-message');
    attachFeedback(answer, payload);
  } catch (error) {
    loading.remove();
    appendMessage(error.message || 'Connection error. Please try again.', 'assistant-message');
  } finally {
    input.disabled = false;
    sendButton.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
});
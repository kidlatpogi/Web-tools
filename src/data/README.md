Data file guide — src/data/tools.js

Structure
- Export two arrays (or more if you add sections): `aiTools` and `dvaTools`.
- Each item should be an object with at least:
  - id: string (unique)
  - name: string
  - url: string (optional)
  - description: string (optional)
  - category: string (for filtering, optional)
  - tags: array of strings (optional)

Example:
{
  id: 'chatgpt',
  name: 'ChatGPT',
  url: 'https://chat.openai.com/',
  description: 'OpenAI conversational model — general purpose assistant.',
  category: 'assistant',
  tags: ['ai','chat']
}

How `App.jsx` uses it
- The app imports `aiTools` and `dvaTools` and maps them into the left-hand lists.
- The selected state stores the `id` of the chosen item. The card component looks up the item by id and displays the fields above.

Adding new items
- Edit `src/data/tools.js` and add objects to the appropriate array. No other code changes are required.

Notes
- Keep `id` values unique across each array.
- If you want images/icons, add `icon` or `logo` fields containing a URL or path and update `ItemCard.jsx`.

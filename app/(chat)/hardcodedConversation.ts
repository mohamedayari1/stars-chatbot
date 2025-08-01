import { ChatMessage } from "@/lib/types";

export const DEMO_MESSAGES: ChatMessage[] = [];

// Hardcoded conversation data
// export const DEMO_MESSAGES: ChatMessage[] = [
//   {
//     id: "1",
//     role: "user",
//     parts: [
//       { type: "text", text: "Hello! Can you help me with React development?" },
//     ],
//   },
//   {
//     id: "2",
//     role: "assistant",
//     parts: [
//       {
//         type: "text",
//         text: "Of course! I'd be happy to help you with React development. What specific questions do you have? Are you looking to learn the basics, work with hooks, or tackle a particular problem?",
//       },
//     ],
//   },
//   // {
//   //   id: "3",
//   //   role: "user",
//   //   parts: [
//   //     {
//   //       type: "text",
//   //       text: "I'm trying to understand useState and useEffect hooks. Can you explain the difference?",
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "4",
//   //   role: "assistant",
//   //   parts: [
//   //     {
//   //       type: "text",
//   //       text: 'Great question! Let me break down the key differences:\n\n**useState**:\n- Manages component state (data that can change)\n- Returns current state and a function to update it\n- Triggers re-render when state changes\n\n**useEffect**:\n- Handles side effects (API calls, subscriptions, DOM manipulation)\n- Runs after component renders\n- Can run on mount, update, or cleanup\n\n**Example:**\n```jsx\nconst [count, setCount] = useState(0); // State\n\nuseEffect(() => {\n  document.title = `Count: ${count}`; // Side effect\n}, [count]);\n```\n\nThink of useState as "what data do I need to track?" and useEffect as "what should happen when things change?"',
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "5",
//   //   role: "user",
//   //   parts: [
//   //     {
//   //       type: "text",
//   //       text: "That makes sense! How about custom hooks? When should I create one?",
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "6",
//   //   role: "assistant",
//   //   parts: [
//   //     {
//   //       type: "text",
//   //       text: "Excellent follow-up! Custom hooks are perfect when you want to:\n\n**1. Reuse Logic**\n- Extract common functionality used across multiple components\n- Avoid code duplication\n\n**2. Complex State Management**\n- Combine multiple useState/useEffect calls\n- Manage related state together\n\n**3. API Integration**\n- Handle data fetching, loading states, and errors\n- Centralize API logic\n\n**Example:**\n```jsx\nfunction useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  \n  const increment = () => setCount(c => c + 1);\n  const decrement = () => setCount(c => c - 1);\n  const reset = () => setCount(initialValue);\n  \n  return { count, increment, decrement, reset };\n}\n```\n\n**When to create one:**\n- Logic is used in 2+ components\n- Logic is complex enough to warrant separation\n- You want to make your components cleaner\n\nStart simple and extract hooks as your app grows!",
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "7",
//   //   role: "user",
//   //   parts: [
//   //     {
//   //       type: "text",
//   //       text: "Thanks! One more question - what's the best way to handle forms in React?",
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "8",
//   //   role: "assistant",
//   //   parts: [
//   //     {
//   //       type: "text",
//   //       text: "Great question! Here are the main approaches for handling forms in React:\n\n**1. Controlled Components (Most Common)**\n```jsx\nfunction LoginForm() {\n  const [formData, setFormData] = useState({\n    email: '',\n    password: ''\n  });\n  \n  const handleChange = (e) => {\n    setFormData({\n      ...formData,\n      [e.target.name]: e.target.value\n    });\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        name=\"email\"\n        value={formData.email}\n        onChange={handleChange}\n      />\n    </form>\n  );\n}\n```\n\n**2. Form Libraries (For Complex Forms)**\n- **React Hook Form**: Lightweight, great performance\n- **Formik**: Feature-rich, good for complex validation\n- **Final Form**: Uncontrolled, subscription-based\n\n**3. Best Practices**\n- Use controlled components for simple forms\n- Add proper validation and error handling\n- Consider accessibility (labels, ARIA)\n- Handle loading states during submission\n\n**Pro tip**: Start with controlled components, then move to libraries if you need advanced features!",
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "9",
//   //   role: "user",
//   //   parts: [
//   //     {
//   //       type: "text",
//   //       text: "Perfect! This has been really helpful. I think I have a good foundation now.",
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: "10",
//   //   role: "assistant",
//   //   parts: [
//   //     {
//   //       type: "text",
//   //       text: "You're very welcome! ��\n\nYou've covered some of the most important React concepts:\n- State management with hooks\n- Side effects and lifecycle\n- Custom hooks for reusability\n- Form handling patterns\n\nYou're well on your way to building great React applications! Remember:\n- Practice is key - build small projects to reinforce concepts\n- The React docs are excellent for reference\n- Don't hesitate to ask more questions as you build\n\nHappy coding! 🚀",
//   //     },
//   //   ],
//   // },
// ];

# Expense Tracker - Personal Finance Management

A modern, professional NextJS expense tracking application that helps you manage your personal finances with ease. Built with NextJS 14, TypeScript, Tailwind CSS, and featuring a clean, intuitive interface.

![Expense Tracker](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-cyan?style=flat-square&logo=tailwind-css)

## 🌟 Features

### Core Functionality
- **Add Expenses**: Create new expense entries with date, amount, category, and description
- **View & Manage**: Browse all expenses in a clean, organized list
- **Edit & Delete**: Modify or remove existing expenses with confirmation dialogs
- **Smart Filtering**: Search and filter expenses by date range, category, or text search
- **Data Persistence**: All data is stored locally in your browser (localStorage)

### Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Other

### Analytics Dashboard
- **Summary Cards**: Total spending, monthly spending, top category, average per transaction
- **Visual Charts**: Interactive pie charts, line charts, and bar charts
- **Category Breakdown**: See spending distribution across categories
- **Quick Stats**: Key metrics like highest/lowest expenses and category usage

### Export & Import
- **CSV Export**: Download your expense data in CSV format
- **Filtered Export**: Export only filtered results
- **Excel Compatible**: Perfect for importing into Excel or Google Sheets

### Professional Design
- **Modern UI**: Clean, professional interface with intuitive navigation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Visual Feedback**: Loading states, error handling, and success notifications
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd expense-tracker-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

The application will start in development mode with hot-reloading enabled.

### Building for Production

```bash
npm run build
npm start
```

## 📱 How to Use

### Adding Your First Expense
1. Navigate to the **Add Expense** tab
2. Enter the amount (e.g., 25.50)
3. Select a category from the dropdown
4. Add a description (e.g., "Lunch at Italian restaurant")
5. Choose the date (defaults to today)
6. Click **Add Expense**

### Viewing and Managing Expenses
1. Go to the **All Expenses** tab
2. Use filters to find specific expenses:
   - **Search**: Type in the description or category
   - **Category**: Filter by specific category
   - **Date Range**: Set from/to dates
3. Click the edit (✏️) icon to modify an expense
4. Click the delete (🗑️) icon to remove an expense (requires confirmation)

### Understanding Your Analytics
1. Visit the **Dashboard** tab for an overview
2. View summary cards showing:
   - Total expenses across all time
   - This month's spending
   - Your top spending category
   - Average amount per transaction
3. Check the category breakdown chart to see spending distribution
4. Use the **Analytics** tab for detailed charts:
   - **By Category**: Pie chart of spending distribution
   - **Spending Trend**: Line chart showing spending over time
   - **Daily Overview**: Bar chart of daily spending

### Exporting Your Data
1. Navigate to the **Export** tab
2. Choose between:
   - **All expenses**: Export everything
   - **Filtered expenses**: Export only what matches current filters
3. Review the export summary
4. Click **Download CSV** to save your data

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Recharts for beautiful data visualizations
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for robust date operations
- **State Management**: React Context with useReducer
- **Data Persistence**: localStorage for client-side storage

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── Dashboard.tsx       # Main dashboard with summary cards
│   ├── ExpenseForm.tsx     # Form for adding/editing expenses
│   ├── ExpenseList.tsx     # List view of expenses
│   ├── ExpenseFilters.tsx  # Filtering controls
│   ├── ExpenseCharts.tsx   # Chart visualizations
│   ├── ExportOptions.tsx   # CSV export functionality
│   ├── Navigation.tsx      # Main navigation bar
│   └── Layout.tsx          # Main application layout
├── contexts/               # React contexts
│   └── ExpenseContext.tsx  # Global expense state management
├── lib/                    # Utility functions
│   ├── storage.ts          # localStorage operations
│   └── utils.ts            # Helper functions
└── types/                  # TypeScript type definitions
    ├── expense.ts          # Expense-related types
    └── index.ts            # Type exports
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## 💾 Data Storage

This application uses localStorage to persist your data, which means:
- ✅ Your data stays private on your device
- ✅ No server required - works offline
- ✅ Fast performance
- ⚠️ Data is device-specific (won't sync across devices)
- ⚠️ Clearing browser data will remove your expenses

**Tip**: Use the export functionality to backup your data regularly!

## 🎨 Customization

The application uses Tailwind CSS for styling. You can easily customize:
- Colors by modifying the color classes
- Layout by adjusting the grid and flexbox utilities
- Typography by changing font classes
- Spacing by updating margin and padding values

## 🐛 Troubleshooting

### Common Issues

1. **Expenses not saving**: 
   - Check if localStorage is enabled in your browser
   - Ensure you're not in private/incognito mode

2. **Charts not displaying**:
   - Make sure you have expenses added
   - Try refreshing the page

3. **Export not working**:
   - Ensure your browser allows file downloads
   - Check that you have expenses to export

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

This is a demonstration project, but you can extend it by:
- Adding new expense categories
- Implementing data sync with cloud services
- Adding more chart types
- Creating expense budgets and alerts
- Adding receipt photo uploads

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with Next.js and React
- Icons by Lucide
- Charts powered by Recharts
- Styling with Tailwind CSS

# Collection Tracker
URL - https://collection-manager-tlhn.vercel.app/dashboard

A full-stack web application built with Next.js and MongoDB for managing collectible items like Pokémon cards, Yu-Gi-Oh! cards, and comic books.

## Features

- **User Authentication**
  - Simple username/password authentication
  - Secure password hashing
  - Local session management

- **Cards Collection (Full CRUD)**
  - Add new cards to your collection
  - View all cards with filtering and sorting
  - Edit card details (name, set, condition, price)
  - Delete cards from collection
  - Add and manage notes for each card

- **Wishlist Management (Full CRUD)**
  - Create wishlist items with priority levels
  - Track desired cards and maximum budget
  - Update wishlist item details
  - Remove items once acquired

- **Trade Listings (Partial CRUD)**
  - Create trade listings for cards
  - Specify what you're looking for in return
  - Remove listings once trades are complete

- **Card Notes (Partial CRUD)**
  - Add notes to specific cards
  - View note history with timestamps
  - Delete unwanted notes

## Tech Stack

- **Frontend**: Next.js 13 with App Router
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **UI Components**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Custom implementation with bcryptjs

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd collection-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

```
collection-tracker/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cards/             # Cards management pages
│   ├── trades/            # Trade listings pages
│   └── wishlist/          # Wishlist management pages
├── components/            # React components
├── lib/                   # Utility functions
├── models/               # Mongoose models
└── public/               # Static files
```

## Features Overview

### Cards Collection
- Add cards with details like name, set, condition, price
- Upload card images
- Filter and sort by various attributes
- Add notes to track card details or history

### Wishlist
- Prioritize wanted cards (1-5 scale)
- Set maximum budget
- Track desired condition
- Organize by card type

### Trade Listings
- List cards available for trade
- Specify cards wanted in return
- Simple trade management

### Notes System
- Add notes to any card in collection
- Track card condition changes
- Record purchase details or grading notes
- View note history with timestamps

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

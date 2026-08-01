CREATE TABLE IF NOT EXISTS enquiries (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    phone TEXT NOT NULL,

    email TEXT NOT NULL,

    service TEXT NOT NULL,

    message TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'Pending',
  
    created_at TEXT DEFAULT (datetime('now', '+5 hours', '+30 minutes')),
    
    updated_at TEXT DEFAULT (datetime('now', '+5 hours', '+30 minutes'))

);

    CREATE TABLE IF NOT EXISTS traffic_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      source_ip TEXT,
      destination_ip TEXT,
      protocol TEXT,
      source_port INTEGER,
      destination_port INTEGER,
      packet_size INTEGER,
      flags TEXT,
      interface TEXT
    );

    CREATE TABLE IF NOT EXISTS network_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      interface TEXT,
      packets_in INTEGER,
      packets_out INTEGER,
      bytes_in INTEGER,
      bytes_out INTEGER,
      packets_per_second REAL,
      mbps_in REAL,
      mbps_out REAL
    );

    CREATE TABLE IF NOT EXISTS protocol_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      protocol TEXT,
      count INTEGER,
      bytes_total INTEGER
    );

    CREATE TABLE IF NOT EXISTS system_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      cpu_usage REAL,
      memory_used INTEGER,
      memory_total INTEGER,
      memory_percent REAL,
      load_avg TEXT
    );

    CREATE TABLE IF NOT EXISTS active_connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      source_ip TEXT,
      destination_ip TEXT,
      protocol TEXT,
      source_port INTEGER,
      destination_port INTEGER,
      state TEXT,
      process_name TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_traffic_events_timestamp ON traffic_events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_traffic_events_source_ip ON traffic_events(source_ip);
    CREATE INDEX IF NOT EXISTS idx_network_stats_timestamp ON network_stats(timestamp);
    CREATE INDEX IF NOT EXISTS idx_protocol_stats_timestamp ON protocol_stats(timestamp);
    
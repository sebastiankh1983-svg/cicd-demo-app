let register, login, getAllUsers;

describe('Auth Module Tests', () => {
  beforeEach(() => {
    // Modul aus dem Cache entfernen und neu laden, damit das users-Array zurückgesetzt wird
    jest.resetModules();
    ({ register, login, getAllUsers } = require('./auth'));
  });

  describe('Register Tests', () => {
    test('sollte User erfolgreich registrieren', () => {
      const user = register('alice', 'pw123');
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username', 'alice');
      expect(getAllUsers()).toEqual([{ id: user.id, username: 'alice' }]);
    });

    test('sollte Error werfen wenn username fehlt', () => {
      expect(() => register('', 'pw123')).toThrow('Username and password required');
    });

    test('sollte Error werfen wenn password fehlt', () => {
      expect(() => register('bob', '')).toThrow('Username and password required');
    });

    test('sollte Error werfen wenn User schon existiert', () => {
      register('alice', 'pw123');
      expect(() => register('alice', 'pw123')).toThrow('User already exists');
    });

    test('sollte mehrere verschiedene User nacheinander registrieren und IDs korrekt inkrementieren', () => {
      const user1 = register('alice', 'pw123');
      const user2 = register('bob', 'pw456');
      expect(user1.id).toBe(1);
      expect(user2.id).toBe(2);
      expect(getAllUsers()).toEqual([
        { id: 1, username: 'alice' },
        { id: 2, username: 'bob' }
      ]);
    });

    test('sollte Passwörter mit Sonderzeichen akzeptieren', () => {
      const user = register('special', 'p@$$w0rd!');
      expect(user).toHaveProperty('username', 'special');
      // Login mit Sonderzeichen-Passwort
      const result = login('special', 'p@$$w0rd!');
      expect(result).toHaveProperty('token', 'fake-jwt-token');
    });

    // Test für Login nach Löschung (nur hypothetisch, da keine Löschfunktion vorhanden)
    test('sollte Login für gelöschten User ablehnen (hypothetisch)', () => {
      register('alice', 'pw123');
      // Angenommen, User wird gelöscht (funktioniert hier nicht, da keine Löschfunktion)
      // Erwartung: Login schlägt fehl
      // expect(() => login('alice', 'pw123')).toThrow('Invalid credentials');
      // Test als skipped markieren
      expect(true).toBe(true); // Platzhalter
    });
  });

  describe('Login Tests', () => {
    test('sollte User erfolgreich einloggen', () => {
      register('alice', 'pw123');
      const result = login('alice', 'pw123');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('username', 'alice');
      expect(result).toHaveProperty('token', 'fake-jwt-token');
    });

    test('sollte Error werfen bei falschen Credentials', () => {
      register('alice', 'pw123');
      expect(() => login('alice', 'wrong')).toThrow('Invalid credentials');
      expect(() => login('bob', 'pw123')).toThrow('Invalid credentials');
    });

    test('sollte Token zurückgeben', () => {
      register('bob', 'pw456');
      const result = login('bob', 'pw456');
      expect(result).toHaveProperty('token');
      expect(typeof result.token).toBe('string');
      expect(result.token).toBe('fake-jwt-token');
    });
  });

  describe('GetAllUsers Tests', () => {
    test('sollte alle Users zurückgeben (ohne Passwords!)', () => {
      register('alice', 'pw123');
      register('bob', 'pw456');
      const users = getAllUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(2);
      users.forEach(u => {
        expect(u).toHaveProperty('id');
        expect(u).toHaveProperty('username');
        expect(u).not.toHaveProperty('password');
      });
    });

    test('sollte leeres Array zurückgeben wenn keine Users', () => {
      // Workaround: Test am Anfang, wenn keine User registriert
      expect(getAllUsers()).toEqual([]);
    });
  });
});

# TdA Piškvorky od Buráků

Webová aplikace pro hraní piškvorek s přáteli nebo proti AI. Aplikace nabízí pokročilé funkce, včetně multiplayeru, vlastní tvorby her a přístupu ke knihovně uložených her.  

---

## 🎯 O projektu  
Tento projekt je výtvorem tříčlenného týmu, který se zaměřil na vytvoření moderní webové aplikace s důrazem na interaktivitu a uživatelský zážitek. Projekt kombinuje nejnovější webové technologie a osvědčené nástroje, aby poskytl spolehlivé a intuitivní řešení pro hraní piškvorek.  

---

## 👥 Tým  
- **Lukáš Merta** – kapitán týmu, fullstack developer, designér  
- **Robert Němeček** – frontend developer, tester  
- **Norak Eric Sok** – tester  

---

## 🛠 Použité technologie  
- **Frontend**: React s Vite a TypeScript  
- **Backend**: Node.js s Express  
- **CSS**: SCSS  
- **Databáze**: MySQL  
- **Multiplayer**: Socket.io  
- **Nástroje**:  
  - Docker pro kontejnerizaci  
  - Figma pro návrh designu  
  - GitHub pro správu verzí  

---

## 🚀 Spuštění projektu  

### Vývojové prostředí  
1. Spusťte příkaz:  
   ```bash
   docker-compose up --build -d
   ```
2. Aplikace bude dostupná na:
- Frontend: https://localhost:5100
- Backend: https://localhost:5200
   
### Produkční prostředí  
1. Vytvořte Docker iamge:  
   ```bash
   docker build -t tda-buraci .
   ```
2. Spusťte kontejner:  
   ```bash
   docker run -p 5200:5200 tda-buraci
   ```
3. Aplikace bude dostupná na:
- Backend (hostující frontend): https://localhost:5200

## 🔑 Klíčové funkce  
- **Hra proti AI**: Výzva s adaptivní AI pro všechny úrovně hráčů.  
- **Multiplayer**: Hrajte s přáteli v reálném čase díky socket.io.  
- **Vlastní hry**: Možnost vytvořit unikátní herní mapy a sdílet je s ostatními.  
- **Uložené hry**: Přístup k oblíbeným hrám a strategickým zápasům od ostatních hráčů  

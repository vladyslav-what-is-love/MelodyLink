const User = require("./user");
const createAdminUser = async () => {
  const userData = {
    // Дані користувача
    firstName: "Степан",
    lastName: "Полуліх",
    email: "je@example.com",
    phone: "+380000000000",
    location: "Львів",
    password: "1234",

    entityType: "admin",
    roleName: "admin",
    roleId: 1,

    // Інші поля користувача, які потрібно встановити
  };

  try {
    const user = await User.createUser(userData);
    console.log("Admin user created:", user);
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }
};

// Виклик функції для створення адміністратора
createAdminUser();

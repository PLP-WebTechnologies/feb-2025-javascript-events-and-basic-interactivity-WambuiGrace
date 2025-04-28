// DOM Elements
const themeButton = document.getElementById("theme-button")
const tabButtons = document.querySelectorAll(".tab-btn")
const tabPanes = document.querySelectorAll(".tab-pane")
const templateCards = document.querySelectorAll(".template-card")
const templateMessage = document.getElementById("template-message")
const prevButton = document.getElementById("prev-btn")
const nextButton = document.getElementById("next-btn")
const galleryImages = document.querySelectorAll(".gallery-img")
const dots = document.querySelectorAll(".dot")
const signupForm = document.getElementById("signup-form")
const fullnameInput = document.getElementById("fullname")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const strengthFill = document.querySelector(".strength-fill")
const strengthText = document.querySelector(".strength-text span")
const formSuccess = document.getElementById("form-success")
const secretPanel = document.getElementById("secret-panel")
const closeSecret = document.getElementById("close-secret")

// Global variables
let currentSlide = 0
let longPressTimer
let selectedTemplate = null

// ==================== EVENT HANDLING ====================

// 1. Button click event
themeButton.addEventListener("click", toggleTheme)

// 2. Hover effects (CSS handles most of this)
const rocketEmoji = document.querySelector(".emoji")
rocketEmoji.addEventListener("mouseover", () => {
  rocketEmoji.textContent = "🚀"
})
rocketEmoji.addEventListener("mouseout", () => {
  rocketEmoji.textContent = "🚀"
})

// 3. Keypress detection
document.addEventListener("keydown", (e) => {
  // Show help when '?' is pressed
  if (e.key === "?") {
    alert(
      "Keyboard Shortcuts:\n• ?: Show this help\n• Arrow keys: Navigate gallery\n• Tab: Navigate between elements\n• Enter: Select focused element\n• Any key: Continue after template selection",
    )
  }

  // Gallery navigation with arrow keys
  if (e.key === "ArrowLeft") {
    showSlide(currentSlide - 1)
  } else if (e.key === "ArrowRight") {
    showSlide(currentSlide + 1)
  }

  // Continue after template selection
  if (templateMessage.classList.contains("active") && !templateMessage.classList.contains("hidden")) {
    templateMessage.classList.add("hidden")
    document.querySelector('[data-tab="gallery"]').click()
  }
})

// 4. BONUS: Double-click and long press
formSuccess.addEventListener("dblclick", showSecretPanel)

// Long press detection
// easterEgg.addEventListener("mousedown", startLongPress)
// easterEgg.addEventListener("mouseup", cancelLongPress)
// easterEgg.addEventListener("mouseleave", cancelLongPress)
// easterEgg.addEventListener("touchstart", startLongPress)
// easterEgg.addEventListener("touchend", cancelLongPress)
// easterEgg.addEventListener("touchcancel", cancelLongPress)

// ==================== INTERACTIVE ELEMENTS ====================

// 1. Button that changes text/color
function toggleTheme() {
  document.body.classList.toggle("dark-theme")
  if (document.body.classList.contains("dark-theme")) {
    themeButton.textContent = "Switch Theme ☀️"
  } else {
    themeButton.textContent = "Switch Theme 🌙"
  }
}

// 2. Tabs
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons and panes
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    tabPanes.forEach((pane) => pane.classList.remove("active"))

    // Add active class to clicked button and corresponding pane
    button.classList.add("active")
    const tabId = button.getAttribute("data-tab")
    document.getElementById(tabId).classList.add("active")
  })
})

// 3. Template selection
templateCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Remove selected class from all cards
    templateCards.forEach((c) => c.classList.remove("selected"))

    // Add selected class to clicked card
    card.classList.add("selected")
    selectedTemplate = card.getAttribute("data-template")

    // Show message
    templateMessage.classList.remove("hidden")
    templateMessage.textContent = `${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} template selected! Press any key to continue.`
  })
})

// 4. Image gallery/slideshow
function showSlide(n) {
  // Handle wrapping around
  if (n >= galleryImages.length) {
    currentSlide = 0
  } else if (n < 0) {
    currentSlide = galleryImages.length - 1
  } else {
    currentSlide = n
  }

  // Hide all images and remove active class from dots
  galleryImages.forEach((img) => img.classList.remove("active"))
  dots.forEach((dot) => dot.classList.remove("active"))

  // Show current image and add active class to corresponding dot
  galleryImages[currentSlide].classList.add("active")
  dots[currentSlide].classList.add("active")
}

// Gallery navigation buttons
prevButton.addEventListener("click", () => showSlide(currentSlide - 1))
nextButton.addEventListener("click", () => showSlide(currentSlide + 1))

// Gallery dots
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const slideIndex = Number.parseInt(dot.getAttribute("data-index"))
    showSlide(slideIndex)
  })
})

// 5. BONUS: Animations (handled in CSS and these functions)
function startLongPress() {
  longPressTimer = setTimeout(() => {
    showSecretPanel()
  }, 1000) // 1 second long press
}

function cancelLongPress() {
  clearTimeout(longPressTimer)
}

function showSecretPanel() {
  secretPanel.classList.remove("hidden")
}

closeSecret.addEventListener("click", () => {
  secretPanel.classList.add("hidden")
})

// ==================== FORM VALIDATION ====================

// 1. Form submission
signupForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Validate all fields
  const isFullnameValid = validateFullname()
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()

  // If all fields are valid, show success message
  if (isFullnameValid && isEmailValid && isPasswordValid) {
    signupForm.reset()
    formSuccess.classList.remove("hidden")

    // Reset validation styles
    document.querySelectorAll(".validation-message").forEach((msg) => {
      msg.textContent = ""
    })
    document.querySelectorAll("input").forEach((input) => {
      input.classList.remove("valid", "error")
    })

    // Reset password strength
    strengthFill.style.width = "0"
    strengthText.textContent = "None"
  }
})

// 2. Real-time validation
fullnameInput.addEventListener("input", validateFullname)
emailInput.addEventListener("input", validateEmail)
passwordInput.addEventListener("input", validatePassword)

// Validation functions
function validateFullname() {
  const fullname = fullnameInput.value.trim()
  const fullnameMessage = fullnameInput.nextElementSibling

  if (fullname === "") {
    setInvalid(fullnameInput, fullnameMessage, "Full name is required")
    return false
  } else if (fullname.length < 3) {
    setInvalid(fullnameInput, fullnameMessage, "Full name must be at least 3 characters")
    return false
  } else {
    setValid(fullnameInput, fullnameMessage, "")
    return true
  }
}

function validateEmail() {
  const email = emailInput.value.trim()
  const emailMessage = emailInput.nextElementSibling
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (email === "") {
    setInvalid(emailInput, emailMessage, "Email is required")
    return false
  } else if (!emailRegex.test(email)) {
    setInvalid(emailInput, emailMessage, "Please enter a valid email address")
    return false
  } else {
    setValid(emailInput, emailMessage, "")
    return true
  }
}

function validatePassword() {
  const password = passwordInput.value
  const passwordMessage = passwordInput.nextElementSibling

  if (password === "") {
    setInvalid(passwordInput, passwordMessage, "Password is required")
    updatePasswordStrength(0)
    return false
  } else if (password.length < 8) {
    setInvalid(passwordInput, passwordMessage, "Password must be at least 8 characters")
    updatePasswordStrength(1)
    return false
  } else {
    // Check password strength
    const strength = calculatePasswordStrength(password)
    updatePasswordStrength(strength)

    if (strength < 2) {
      setInvalid(passwordInput, passwordMessage, "Password is too weak")
      return false
    } else {
      setValid(passwordInput, passwordMessage, "")
      return true
    }
  }
}

function calculatePasswordStrength(password) {
  let strength = 0

  // Length check
  if (password.length >= 8) strength += 1
  if (password.length >= 12) strength += 1

  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^A-Za-z0-9]/.test(password)) strength += 1

  // Normalize to 0-4 scale
  return Math.min(4, Math.floor(strength / 1.5))
}

function updatePasswordStrength(strength) {
  const strengthLabels = ["None", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["#ef4444", "#ef4444", "#f59e0b", "#10b981", "#10b981"]
  const strengthPercentages = ["0%", "25%", "50%", "75%", "100%"]

  strengthFill.style.width = strengthPercentages[strength]
  strengthFill.style.backgroundColor = strengthColors[strength]
  strengthText.textContent = strengthLabels[strength]
}

// Helper functions for validation
function setInvalid(input, messageElement, message) {
  input.classList.remove("valid")
  input.classList.add("error")
  messageElement.textContent = message
}

function setValid(input, messageElement, message) {
  input.classList.remove("error")
  input.classList.add("valid")
  messageElement.textContent = message
}

// Initialize the page
function init() {
  // Set first tab as active
  tabButtons[0].classList.add("active")
  tabPanes[0].classList.add("active")

  // Set first slide as active
  showSlide(0)
}

// Run initialization
init()

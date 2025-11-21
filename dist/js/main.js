document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.backgroundColor = '#050a14';
        navMenu.style.padding = '20px';
        navMenu.style.zIndex = '1000';
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // CTA buttons handler
  document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Search initiated');
    });
  });
});
/**
 * Класс для управления тумблером "Покупка/Аренда"
 * Реализует паттерн "один из" с визуальной обратной связью
 */
class PropertyTypeToggle {
  /**
   * @param {string} containerSelector - CSS селектор контейнера с кнопками
   */
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error('❌ Контейнер для тумблера не найден');
      return;
    }
    
    // Находим все кнопки с data-type атрибутом
    this.buttons = this.container.querySelectorAll('[data-type]');
    this.activeType = 'purchase'; // Значение по умолчанию
    
    // Проверяем найдены ли кнопки
    if (this.buttons.length === 0) {
      console.error('❌ Кнопки тумблера не найдены');
      return;
    }
    
    this.init();
    console.log('✅ Тумблер инициализирован. Активный тип:', this.activeType);
  }
  
  /**
   * Инициализация обработчиков событий
   */
  init() {
    // Устанавливаем обработчики кликов на каждую кнопку
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const clickedButton = e.currentTarget;
        const type = clickedButton.dataset.type;
        
        // Переключаем только если кликнули на неактивную кнопку
        if (type !== this.activeType) {
          this.setActiveButton(type);
        }
      });
    });
    
    // Устанавливаем начальное состояние
    this.setActiveButton(this.activeType);
  }
  
  /**
   * Устанавливает активную кнопку и обновляет визуальное состояние
   * @param {string} type - Тип сделки ('purchase' | 'rent')
   */
  setActiveButton(type) {
    // Убираем active со всех кнопок
    this.buttons.forEach(btn => btn.classList.remove('active'));
    
    // Добавляем active к нужной кнопке
    const activeButton = this.container.querySelector(`[data-type="${type}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
      this.activeType = type;
      
      // Генерируем кастомное событие при изменении
      this.dispatchChangeEvent();
      console.log('🔄 Тип сделки изменён на:', this.activeType);
    }
  }
  
  /**
   * Генерирует кастомное событие при изменении типа
   */
  dispatchChangeEvent() {
    const event = new CustomEvent('propertyTypeChange', { 
      detail: { 
        type: this.activeType,
        timestamp: new Date().toISOString()
      },
      bubbles: true,
      cancelable: true
    });
    
    this.container.dispatchEvent(event);
  }
  
  /**
   * Возвращает текущий активный тип сделки
   * @returns {string}
   */
  getActiveType() {
    return this.activeType;
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const propertyToggle = new PropertyTypeToggle('.store-property-selector-container');
  

  document.querySelector('.store-property-selector-container').addEventListener('propertyTypeChange', (e) => {
    console.log('📢 Событие изменения типа:', e.detail);

    updateBudgetOptions(e.detail.type);
  });
  
  // Пример функции обновления опций бюджета
  function updateBudgetOptions(type) {
    const budgetSelect = document.getElementById('budget');
    if (!budgetSelect) return;
    
    const currentValue = budgetSelect.value;
    
    budgetSelect.innerHTML = '';
    
    const options = type === 'rent' 
      ? [
          { value: '', text: 'Любой' },
          { value: '0-50', text: 'До 50 тыс' },
          { value: '50-100', text: '50-100 тыс' },
          { value: '100+', text: 'Свыше 100 тыс' }
        ]
      : [
          { value: '', text: 'Любой' },
          { value: '0-5', text: 'До 5 млн' },
          { value: '5-10', text: '5-10 млн' },
          { value: '10+', text: 'Свыше 10 млн' }
        ];
    
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.text;
      budgetSelect.appendChild(option);
    });
    
    if (options.some(opt => opt.value === currentValue)) {
      budgetSelect.value = currentValue;
    }
  }
  
  document.getElementById('searchButton')?.addEventListener('click', () => {
    const activeType = propertyToggle.getActiveType();
    const filters = {
      dealType: activeType, 
      propertyType: document.getElementById('propertyType')?.value,
      budget: document.getElementById('budget')?.value,
      district: document.getElementById('district')?.value,
      rooms: document.getElementById('rooms')?.value
    };
    
    console.log('🔍 Параметры поиска:', filters);

  });
});

function initSimpleToggle() {
  const container = document.querySelector('.store-property-selector-container');
  if (!container) return;
  
  const buttons = container.querySelectorAll('[data-type]');
  let activeType = 'purchase';
  
  function setActiveButton(type) {
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    activeType = type;
    
    container.dispatchEvent(new CustomEvent('propertyTypeChange', { 
      detail: { type } 
    }));
  }
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.type !== activeType) {
        setActiveButton(button.dataset.type);
      }
    });
  });
  
  setActiveButton(activeType);
  
  return {
    getActiveType: () => activeType
  };
}


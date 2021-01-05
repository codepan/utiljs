const isString = target => typeof target === 'string';

// 全屏模式-采用哪种方式进行在全屏 h5模式和css模式
const FULLSCREEN_MODE = {
  H5: 'H5',
  CSS: 'CSS',
};

// 全屏状态-当前处于哪种状态 正常状态和全屏状态
const STATUS = {
  NORMAL: Symbol('normal'),
  FULLSCREEN: Symbol('fullscreen'),
};

// 通过css实现全屏时默认的css样式
const CSS_TEXT = 'position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1000; width: auto; height: auto; overflow: auto;';

interface IOptions {
  style?: {},
  className?: string,
  tip?: string,
}

const styleUtil = {
  adapteStyle(style: {}) {
    const entries = Object.entries(style).map(([key, value]) => {
      const regExp = /([A-Z])/g;
      // eslint-disable-next-line no-param-reassign
      key = key.replace(regExp, (match, $1) => `-${$1.toLowerCase()}`);
      return {
        key,
        value,
      };
    });

    const targetStyle = entries.reduce((memo, entry) => {
      // eslint-disable-next-line no-param-reassign
      memo[entry.key] = entry.value;
      return memo;
    }, {});

    return targetStyle;
  },
  toCssText(style: {}, isAdapte = true) {
    // eslint-disable-next-line no-param-reassign
    style = isAdapte ? this.adapteStyle(style) : style;
    const cssText = Object.entries(style).reduce((memo, entry) => {
      const [key, value] = entry;
      // eslint-disable-next-line no-param-reassign
      memo += `${key}: ${value};`;
      return memo;
    }, '');
    return cssText;
  },
  joinCssText(cssText1 = '', cssText2 = '') {
    if (!cssText1) {
      return cssText2;
    }

    if (cssText1.endsWith(';') || cssText2.startsWith(';')) {
      return cssText1 + cssText2;
    }

    return `${cssText1};${cssText2}`;
  },
};


const isNativeFullscreen = () => (
  document.fullscreenElement
  || (document as any).msFullscreenElement
  || (document as any).mozFullScreenElement
  || (document as any).webkitFullscreenElement
  || false
);

class Fullscreen {
  private element: HTMLElement | any;
  private fullscreenMode = '';
  private originCssText = '';
  private status: Symbol;
  private callback: Function;
  public constructor(element?: any) {
    this.element = this.getElement(element);
    this.status = STATUS.NORMAL;
    this.bindEscEvent();
  }

  public enter(options?: IOptions) {
    if (this.status === STATUS.FULLSCREEN) return;
    if (this.fullscreenEnable()) {
      this.enterByH5();
    } else {
      this.enterByCSS(options);
    }
    this.status = STATUS.FULLSCREEN;
    this.callback?.(true);
  }

  public exit() {
    if (this.status === STATUS.NORMAL) return;
    if (this.fullscreenMode === FULLSCREEN_MODE.H5) {
      this.exitByH5();
    }

    if (this.fullscreenMode === FULLSCREEN_MODE.CSS) {
      this.exitByCSS();
    }

    this.status = STATUS.NORMAL;
    this.fullscreenMode = '';
    this.callback?.(false);
  }

  public toggle() {
    this.status === STATUS.NORMAL ? this.enter() : this.exit();
  }

  public onChange(callback: Function) {
    this.callback = callback;
  }

  public isFullscreen() {
    return this.status === STATUS.FULLSCREEN;
  }

  public setElement(element) {
    this.element = this.getElement(element);
    this.bindEscEvent();
  }

  private getElement(element) {
    if (!element) {
      return document.documentElement;
    }
    return isString(element) ? document.querySelector(element) : element;
  }

  private fullscreenEnable() {
    // return document.fullscreenEnabled
    // || (document as any).mozFullScreenEnabled
    // || (document as any).msFullscreenEnabled;
    return false;
  }

  private enterByH5() {
    const { element } = this;
    this.fullscreenMode = FULLSCREEN_MODE.H5;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.oRequestFullscreen) {
      element.oRequestFullscreen();
    }
  }

  private enterByCSS(options?: IOptions) {
    const { element } = this;
    this.fullscreenMode = FULLSCREEN_MODE.CSS;
    this.originCssText = element.style.cssText;
    if (!options) {
      element.style.cssText += CSS_TEXT;
    } else {
      const { style = { background: '#f2f2f2' }, className } = options;
      const cssText = styleUtil.toCssText(style);
      element.style.cssText += styleUtil.joinCssText(CSS_TEXT, cssText);
      element.classList.add(className);
      element.myClassName = className;
    }
  }

  private exitByH5() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).oCancelFullScreen) {
      (document as any).oCancelFullScreen();
    }
  }

  private exitByCSS() {
    const { element } = this;
    element.removeAttribute('style');
    element.style.cssText = this.originCssText;
    this.originCssText = '';

    element.classList.remove(element.myClassName);
  }

  private bindEscEvent() {
    const exitCallback = (event) => {
      if (event && event.keyCode === 27) {
        this.exit();
      };
    };

    document.addEventListener('keydown', exitCallback);

    document.addEventListener('fullscreenchange', () => {
      if (!isNativeFullscreen()) this.exit();
    });
  }
}

export default Fullscreen;

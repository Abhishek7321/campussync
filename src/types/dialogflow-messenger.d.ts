declare namespace JSX {
  interface IntrinsicElements {
    'df-messenger': {
      'intent'?: string;
      'chat-title'?: string;
      'agent-id': string;
      'language-code'?: string;
      'chat-icon'?: string;
      'user-id'?: string;
      'allow-feedback'?: boolean | string;
      'expand'?: boolean | string;
      children?: React.ReactNode;
      [key: string]: any;
    }
  }
}
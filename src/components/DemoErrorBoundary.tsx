import React from 'react';
import { DemoNotice } from './DemoNotice';

/* Si una demo de "Ver proyecto" falla al renderizar, se muestra un aviso en lugar de
   dejar en blanco todo el portafolio. El resto de la página sigue funcionando. */

interface Props {
  /** Nombre de la demo, para el mensaje y el registro en consola */
  name: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface State {
  failed: boolean;
}

export class DemoErrorBoundary extends React.Component<Props, State> {
  // El proyecto no instala @types/react: se declaran los miembros que usa este componente
  declare props: Props;
  declare setState: (state: State) => void;
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`[demo ${this.props.name}]`, error);
  }

  componentDidUpdate(prev: Props) {
    // Al volver a abrir la demo se intenta de nuevo desde cero
    if (this.state.failed && !prev.isOpen && this.props.isOpen) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (!this.props.isOpen) return null;
    return (
      <DemoNotice
        id={`demo-error-${this.props.name}`}
        eyebrow={this.props.name}
        icon="info"
        title="No se pudo cargar esta demostración"
        actions={[
          { label: 'Reintentar', onClick: () => this.setState({ failed: false }) },
          { label: 'Cerrar', onClick: this.props.onClose },
        ]}
        onClose={this.props.onClose}
      >
        Ocurrió un error inesperado al abrir la demo. El resto del portafolio sigue funcionando con normalidad.
      </DemoNotice>
    );
  }
}

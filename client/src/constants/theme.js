/**
 * Professional Color Palette & Theme Constants
 * Centralized color scheme for the entire application
 */

// Primary Colors
export const COLORS = {
  // Core Palette
  primary: '#2c3e50',      // Navy - Primary headers, buttons
  secondary: '#2980b9',    // Blue - Info, secondary actions
  success: '#27ae60',      // Green - Success, completed, approved
  warning: '#e67e22',      // Orange - Pending, in progress, warning
  danger: '#e74c3c',       // Red - Error, danger, cancelled
  info: '#3498db',         // Light Blue - Information
  
  // Neutral Colors
  dark: '#2c3e50',
  light: '#ecf0f1',
  muted: '#95a5a6',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  textMuted: '#95a5a6',
  border: '#ecf0f1',
  
  // Background Colors
  background: '#f4f6f9',
  white: '#ffffff',
  black: '#000000',
  
  // Status Colors
  status: {
    pending: '#e67e22',
    active: '#27ae60',
    inactive: '#95a5a6',
    error: '#e74c3c',
    warning: '#f39c12',
    info: '#3498db',
  },
};

// Role-based Colors
export const ROLE_COLORS = {
  admin: '#2c3e50',
  doctor: '#2980b9',
  nurse: '#27ae60',
  receptionist: '#8e44ad',
  lab_staff: '#e67e22',
  pharmacist: '#e74c3c',
  patient: '#3498db',
};

// Status-specific Colors
export const STATUS_COLORS = {
  // Appointment
  scheduled: '#e67e22',
  completed: '#27ae60',
  cancelled: '#e74c3c',
  'no-show': '#95a5a6',
  
  // Admission
  admitted: '#2980b9',
  discharged: '#27ae60',
  transferred: '#8e44ad',
  
  // Bed
  available: '#27ae60',
  occupied: '#e74c3c',
  maintenance: '#e67e22',
  
  // Bill
  unpaid: '#e67e22',
  paid: '#27ae60',
  partial: '#2980b9',
  refunded: '#8e44ad',
  
  // Lab
  requested: '#e67e22',
  'in-progress': '#2980b9',
  
  // Medicine
  'in-stock': '#27ae60',
  'out-of-stock': '#e74c3c',
  'low-stock': '#e67e22',
};

// Spacing System (in pixels)
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

// Font Sizes
export const FONT_SIZES = {
  xs: '11px',
  sm: '12px',
  base: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

// Font Weights
export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Border Radius
export const BORDER_RADIUS = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '8px',
  xl: '12px',
  full: '50%',
};

// Shadows
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 4px rgba(0, 0, 0, 0.08)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.10)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.12)',
  hover: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

// Transitions
export const TRANSITIONS = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
  smooth: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Z-Index Scale
export const Z_INDEX = {
  base: 1,
  dropdown: 100,
  sticky: 500,
  fixed: 1000,
  modal: 1300,
  tooltip: 1400,
  notification: 1500,
};

// Component Sizes
export const SIZES = {
  // Button sizes
  button: {
    xs: { padding: '4px 8px', fontSize: FONT_SIZES.xs },
    sm: { padding: '6px 10px', fontSize: FONT_SIZES.sm },
    md: { padding: '8px 12px', fontSize: FONT_SIZES.base },
    lg: { padding: '10px 16px', fontSize: FONT_SIZES.md },
  },
  
  // Input sizes
  input: {
    sm: { padding: '6px 10px', fontSize: FONT_SIZES.sm },
    md: { padding: '8px 12px', fontSize: FONT_SIZES.base },
    lg: { padding: '10px 16px', fontSize: FONT_SIZES.md },
  },
};

// Gradient Backgrounds
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  success: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
  warning: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
  danger: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
  info: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
};

/**
 * Common Style Objects for Reuse
 */

export const STYLES = {
  // Card styling
  card: {
    background: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    boxShadow: SHADOWS.md,
    transition: `all ${TRANSITIONS.normal}`,
  },
  
  // Table header styling
  tableHeader: {
    background: COLORS.primary,
    color: COLORS.white,
    padding: `${SPACING.md} ${SPACING.lg}`,
    textAlign: 'left',
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.sm,
  },
  
  // Table cell styling
  tableCell: {
    padding: `${SPACING.md} ${SPACING.lg}`,
    borderBottom: `1px solid ${COLORS.border}`,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
  },
  
  // Status badge styling
  badge: {
    display: 'inline-block',
    padding: `${SPACING.xs} ${SPACING.md}`,
    borderRadius: BORDER_RADIUS.xl,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    textAlign: 'center',
  },
  
  // Button styling
  button: {
    padding: `${SPACING.sm} ${SPACING.md}`,
    border: 'none',
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    cursor: 'pointer',
    transition: `all ${TRANSITIONS.normal}`,
    color: COLORS.white,
  },
  
  // Input styling
  input: {
    padding: `${SPACING.sm} ${SPACING.md}`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZES.base,
    fontFamily: 'inherit',
    transition: `all ${TRANSITIONS.normal}`,
    '&:focus': {
      outline: 'none',
      borderColor: COLORS.secondary,
      boxShadow: `0 0 0 3px rgba(41, 128, 185, 0.1)`,
    },
  },
  
  // Text input with focus effect
  inputFocus: {
    outline: 'none',
    borderColor: COLORS.secondary,
    boxShadow: `0 0 0 3px rgba(41, 128, 185, 0.1)`,
  },
  
  // Label styling
  label: {
    display: 'block',
    marginBottom: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  
  // Section styling
  section: {
    marginBottom: SPACING.xxxl,
  },
};

/**
 * Helper function to get status color
 */
export const getStatusColor = (status) => {
  const normalized = status?.toLowerCase().replace(/\s+/g, '-');
  return STATUS_COLORS[normalized] || COLORS.muted;
};

/**
 * Helper function to get role color
 */
export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || COLORS.muted;
};

/**
 * Helper function to get badge background based on status
 */
export const getStatusBadgeStyle = (status) => ({
  ...STYLES.badge,
  background: getStatusColor(status),
});

export default {
  COLORS,
  ROLE_COLORS,
  STATUS_COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
  SIZES,
  GRADIENTS,
  STYLES,
  getStatusColor,
  getRoleColor,
  getStatusBadgeStyle,
};

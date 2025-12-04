import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  maxWidth?: 'lg' | 'xl' | 'md' | 'sm' | 'xs' | false;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  gradientFrom = '#006000',
  gradientTo = '#009e60',
  maxWidth = 'lg',
}) => {
  const logoUrl = `${process.env.PUBLIC_URL}/logo-coordinacion.png`;

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        color: '#FFFFFF',
        py: { xs: 3, md: 4 },
        mb: { xs: 4, md: 5 },
      }}
    >
      <Container maxWidth={maxWidth}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              component="img"
              src={logoUrl}
              alt="Coordinación de Sistema Abierto"
              sx={{
                width: { xs: 70, sm: 90 },
                height: { xs: 70, sm: 90 },
                objectFit: 'contain',
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.15)',
                p: 1,
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle1" sx={{ opacity: 0.85 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>
          {actions && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              {actions}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default PageHeader;


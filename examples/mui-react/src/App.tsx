import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Link,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCounter } from './hooks/useCounter';
import viteLogo from './media/vite.png';
import { css } from '@emotion/css';

const emotionCssStyle = css`
  background-color: blueviolet;
  color: white;
  padding: 16px;
`;

// Custom styled components using MUI's styled API
const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius * 2,
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const LogoImage = styled('img')({
  width: 100,
  height: 100,
  objectFit: 'contain',
});

function App() {
  const { count, increment } = useCounter();

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          <Box component="span" fontWeight="bold" className={emotionCssStyle}>
            Vitest Preview with MUI!
          </Box>
        </Typography>
        <div className={emotionCssStyle}>Hello</div>

        <Grid container justifyContent="center" spacing={2}>
          <Grid>
            <LogoImage src={viteLogo} alt="Vite Logo" />
          </Grid>
          <Grid>
            <LogoImage src="/vitest.png" alt="Vitest Logo" />
          </Grid>
        </Grid>

        <Card variant="outlined" sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <StyledButton
              variant="contained"
              color="primary"
              size="large"
              onClick={increment}
            >
              count is: {count}
            </StyledButton>
          </CardContent>
        </Card>

        <Typography>
          Edit{' '}
          <Box
            component="code"
            sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}
          >
            App.test.tsx
          </Box>{' '}
          and save to test HMR updates.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Link
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </Link>
          <Typography>|</Typography>
          <Link
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </Link>
          <Typography>|</Typography>
          <Link
            href="https://mui.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            MUI
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;

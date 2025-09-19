import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react';
import { useCounter } from './hooks/useCounter';
import viteLogo from './media/vite.png';

function App() {
  const { count, increment } = useCounter();

  return (
    <Container maxW="container.md" centerContent py={10}>
      <VStack gap={6}>
        <Heading as="h1" size="xl">
          <Text as="span" fontWeight="bold">
            Vitest Preview
          </Text>
          with Chakra UI!
        </Heading>

        <Flex gap={4} justifyContent="center">
          <Image src={viteLogo} alt="Vite Logo" boxSize="100px" />
          <Image src="/vitest.png" alt="Vitest Logo" boxSize="100px" />
        </Flex>

        <Box>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={increment}
            _hover={{ bg: 'teal.500' }}
          >
            count is: {count}
          </Button>
        </Box>

        <Text>
          Edit{' '}
          <Box as="code" bg="gray.100" px={2} py={1} borderRadius="md">
            App.test.tsx
          </Box>{' '}
          and save to test HMR updates.
        </Text>

        <Flex gap={2}>
          <Link
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            color="teal.500"
            _hover={{ textDecoration: 'underline' }}
          >
            Learn React
          </Link>
          <Text>|</Text>
          <Link
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
            color="teal.500"
            _hover={{ textDecoration: 'underline' }}
          >
            Vite Docs
          </Link>
          <Text>|</Text>
          <Link
            href="https://chakra-ui.com"
            target="_blank"
            rel="noopener noreferrer"
            color="teal.500"
            _hover={{ textDecoration: 'underline' }}
          >
            Chakra UI
          </Link>
        </Flex>
      </VStack>
    </Container>
  );
}

export default App;

import {
  Container,
  Heading,
  Center,
  Spinner,
  Alert,
  VStack,
  Text,
  HStack,
  Box,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import useSWR from "swr";
import Link from "next/link";

import fetcher from "utils/fetcher";

export default function Home() {
  const { data, error } = useSWR("/api/doctors", fetcher);
  const isLoading = !error && !data;
  return (
    <Container>
      <Center mt="2em">
        <VStack spacing="1em">
          <VStack>
            <Heading>Form Filler</Heading>
            <Text>Select a doctor to view available forms.</Text>
          </VStack>
          {isLoading && <Spinner />}
          {error && <Alert status="error">Unexpected Error</Alert>}
          {data && (
            <VStack>
              {data.doctors.map((doctor) => (
                <Link href={`/doctors/${doctor.id}`} key={doctor.id} passHref>
                  <HStack
                    bg="gray.100"
                    p=".8em"
                    borderRadius="md"
                    shadow="md"
                    width="sm"
                    justifyContent="space-between"
                    cursor="pointer"
                  >
                    <VStack align="start">
                      <Heading size="md">
                        {doctor.firstName} {doctor.lastName}
                      </Heading>
                      <Text fontSize="sm">{doctor.birthday}</Text>
                    </VStack>
                    <ArrowForwardIcon w={8} h={8} />
                  </HStack>
                </Link>
              ))}{" "}
            </VStack>
          )}
        </VStack>
      </Center>
    </Container>
  );
}

import {
  Container,
  HStack,
  VStack,
  Text,
  Spinner,
  Alert,
  Heading,
  Button,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "utils/fetcher";
import NextLink from "next/link";
import { PlusSquareIcon, ChevronLeftIcon } from "@chakra-ui/icons";

export default function Doctor() {
  const router = useRouter();
  const { doctor: doctorId } = router.query;

  const { data: doctorsData, error: doctorsError } = useSWR(
    "/api/doctors",
    fetcher
  );
  console.log(doctorsError);
  const doctorsIsLoading = !doctorsError && !doctorsData;

  const doctor = doctorsData?.doctors?.find((doctor) => doctor.id === doctorId);

  const { data: formsData, error: formsError } = useSWR("/api/forms", fetcher);
  const formsIsLoading = !formsError && !formsData;

  return (
    <Container>
      <VStack mt="1em" spacing="1em">
        <Heading>Doctor Information</Heading>
        {doctorsIsLoading && <Spinner />}
        {doctorsError && (
          <Alert>Something went wrong loading doctor information.</Alert>
        )}
        {doctor && (
          <VStack
            p="1em"
            borderRadius="md"
            shadow="md"
            align="start"
            bg="gray.50"
          >
            <DataField title="First Name:" value={doctor.firstName} />
            <DataField title="Last Name:" value={doctor.lastName} />
            <DataField title="Gender:" value={doctor.gender} />
            <DataField title="Date of Birth:" value={doctor.birthday} />
          </VStack>
        )}
        {formsIsLoading && <Spinner />}
        {formsError && (
          <Alert>Something went wrong loading form information.</Alert>
        )}
        {formsData && (
          <VStack>
            {formsData.forms.map((form) => (
              <HStack
                key={form.id}
                borderRadius="md"
                shadow="md"
                p="1em"
                bg="gray.100"
              >
                <Link href={form.url} target="_blank" rel="noreferrer">
                  {form.name}
                </Link>
                <NextLink
                  href={`/api/doctors/${doctorId}/forms/${form.id}`}
                  passHref
                >
                  <a target="_blank" rel="noreferrer">
                    <Button variant="ghost" colorScheme="black">
                      <HStack>
                        <Text>Fill</Text> <PlusSquareIcon />
                      </HStack>
                    </Button>
                  </a>
                </NextLink>
              </HStack>
            ))}
          </VStack>
        )}
        <NextLink href="/" passHref>
          <Link>
            <HStack spacing={1}>
              <ChevronLeftIcon />
              <Text>Back</Text>
            </HStack>
          </Link>
        </NextLink>
      </VStack>
    </Container>
  );
}

function DataField({ title, value }) {
  return (
    <HStack>
      <Heading size="sm">{title}</Heading>
      <Text>{value}</Text>
    </HStack>
  );
}

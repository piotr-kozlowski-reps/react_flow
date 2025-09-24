import type { AxiosError } from "axios";

type Props = {
  error: AxiosError | null;
};

const ErrorInfo = (props: Props) => {
  const { error } = props;

  const message = error ? error.message : "Wystąpił błąd";

  return <div>{message}</div>;
};
export default ErrorInfo;

import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

export default function FormProvider({ children, onSubmit, methods }: Props) {
  return (
    <Form {...methods}>
      <form
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement;
          const isMultiline = target.tagName === 'TEXTAREA';

          if (e.key === 'Enter' && !isMultiline) {
            e.preventDefault();
          }
        }}>
        {children}
      </form>
    </Form>
  );
}

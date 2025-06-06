import CheckboxInput from '@/common/components/form-components/checkbox-input';
import Input from '@/common/components/form-components/input-field';
import RadioButtonInput from '@/common/components/form-components/radio-btn-input';
import { useGetLanguages } from '@/common/services/queries/get-languages.query';
import {
  FilterInSearch,
  Usage,
  Visibility,
} from '@/common/types/enums/taxonomy/taxonomy';
import { Button } from '@/components/ui/button';
import { enumToOptions } from '@/lib/convert-enum-into-key-value-pair';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useCreateTaxonomy } from '../../_mutations/create-taxonomy.mutation';
import { getCreateTaxonomySchema } from '../../_schema/create-taxonomy-schema';
import { useEffect, useState } from 'react';
import SuccessModal from '@/common/components/modals/success-modal';
import tick from '../../../../../../../../../public/assets/icons/tick-circle-rounded.svg';
import DataLoader from '@/common/components/common/data-loader';

const CreateTaxonomyForm = () => {
  const [projectId, setProjectId] = useState<number | null>(null);

  // Modal states
  const [success, setSuccess] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean | null>(null);

  // Fetch all languages
  const { data, isLoading } = useGetLanguages();

  const filterInSearchOptions = enumToOptions(FilterInSearch);
  const usageOptions = enumToOptions(Usage);
  const visibilityOptions = enumToOptions(Visibility);

  const params = useParams();

  const router = useRouter();

  // Create taxonomy
  const { mutate, isPending } = useCreateTaxonomy(
    params.id as string,
    params['project-id'] as string,
  );

  const initialValues = {
    labels: Object.fromEntries(
      (data?.languages ?? []).map(lang => [lang.contract_name, '']),
    ),
    portingCode: '',
    filterInSearch: 'true',
    matchMakingAlgo: 'true',
    usage: [],
    visibility: 'users',
  };

  const validationSchema =
    data?.languages && getCreateTaxonomySchema(data?.languages);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: values => {
      const langArray = Object.entries(values.labels)
        .map(([langName, value]) => {
          const lang = data?.languages.find(l => l.contract_name === langName);
          return {
            language_id: lang?.contract_id ?? null,
            value,
          };
        })
        .filter(item => item.language_id !== null);
      mutate(
        {
          values: langArray,
          portingCode: values.portingCode.toUpperCase(),
          isEnabledAsFilterInSearch: !!values.filterInSearch,
          isEnabledInMatchmakingAlgorithm: !!values.matchMakingAlgo,
          usage: values.usage,
          visibility: values.visibility,
        },
        {
          onSuccess(data) {
            formik.resetForm();
            setProjectId(data.project_id);
            setCreated(true);
            setSuccess(true);
          },
        },
      );
    },
  });

  useEffect(() => {
    if (!success && created) {
      router.push(
        `/contracts/${params.id}/create-project/${projectId}/taxonomy`,
      );
      setCreated(null);
    }
  }, [success, created]);

  return (
    <>
      {isLoading ? (
        <DataLoader className='h-[80vh]' />
      ) : (
        <form
          onSubmit={formik.handleSubmit}
          className='space-y-4'
        >
          {data?.languages.map((input, index) => (
            <Input
              key={index}
              label={`Enter Taxonomy Title (in ${input.contract_name})`}
              value={formik.values.labels[input.contract_name] || ''}
              required={true}
              name={`labels.${input.contract_name}`} // important for Formik to track the field
              placeholder='Technology'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.labels?.[input.contract_name] &&
                Boolean(formik.errors.labels?.[input.contract_name])
              }
              helperText={
                formik.touched.labels?.[input.contract_name]
                  ? formik.errors.labels?.[input.contract_name]
                  : ''
              }
            />
          ))}
          <Input
            label='Enter Porting Code'
            value={formik.values.portingCode || ''}
            required={true}
            name='portingCode'
            className='uppercase'
            placeholder='TECH-001'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.portingCode && Boolean(formik.errors.portingCode)
            }
            helperText={
              formik.touched.portingCode ? formik.errors.portingCode : ''
            }
          />
          <RadioButtonInput
            label='Use these taxonomies as a filter in search'
            options={filterInSearchOptions}
            className='grid grid-cols-2 gap-2'
            name='filterInSearch'
            required={true}
            value={formik.values.filterInSearch}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.filterInSearch &&
              Boolean(formik.errors.filterInSearch)
            }
            helperText={
              formik.touched.filterInSearch ? formik.errors.filterInSearch : ''
            }
          />
          <RadioButtonInput
            label='Have you incorporate this taxonomy into the platforms matchmaking algorithms ?'
            options={filterInSearchOptions}
            className='grid grid-cols-2 gap-2'
            name='matchMakingAlgo'
            required={true}
            value={formik.values.matchMakingAlgo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.matchMakingAlgo &&
              Boolean(formik.errors.matchMakingAlgo)
            }
            helperText={
              formik.touched.matchMakingAlgo
                ? formik.errors.matchMakingAlgo
                : ''
            }
          />
          <CheckboxInput
            label='Select where these taxonomy will be used to'
            name='usage'
            required={true}
            options={usageOptions}
            value={formik.values.usage}
            onChange={formik.handleChange}
            error={formik.touched.usage && Boolean(formik.errors.usage)}
            helperText={
              formik.touched.usage ? (formik.errors.usage as string) : ''
            }
            className='grid grid-cols-4 gap-2'
          />
          <RadioButtonInput
            label='Define the audience for this taxonomys visibility.'
            options={visibilityOptions}
            className='grid grid-cols-2 gap-2'
            name='visibility'
            required={true}
            value={formik.values.visibility}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.visibility && Boolean(formik.errors.visibility)
            }
            helperText={
              formik.touched.visibility ? formik.errors.visibility : ''
            }
          />
          <div className='flex justify-end'>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                className='bg-white hover:bg-white border border-primary-hex text-primary-hex'
                onClick={() =>
                  router.push(
                    `/contracts/${params.id}/create-project/${params['project-id'] ?? ''}/taxonomy`,
                  )
                }
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isPending}
              >
                Continue
              </Button>
            </div>
          </div>
          <SuccessModal
            img={tick}
            text='The Taxonomy created. You can now start creating options for this taxonomy'
            btnText='Create Options'
            openModal={success}
            setOpenModal={setSuccess}
            onClick={() => {
              setSuccess(false);
              if (projectId) {
                router.push(
                  `/contracts/${params.id}/create-project/${projectId}/taxonomy`,
                );
              }
            }}
          />
        </form>
      )}
    </>
  );
};

export default CreateTaxonomyForm;

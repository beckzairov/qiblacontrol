import AgreementForm from '@/app/components/Agreement';

export default async function EditAgreementPage({ params }) {
    const { id } = await params; // Await params to ensure it's resolved before use
  
    return <AgreementForm isEdit={true} agreementId={id} />;
  }

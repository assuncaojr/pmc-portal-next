import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { WPFBFormRenderer } from "@/components/wp-form-renderer";
import { generatePMCSEO } from "@/lib/seo";
import type { Metadata } from "next";

interface FormPageProps {
  params: Promise<{ id: string }>;
}

async function fetchFormData(formId: string) {
  const apiBaseUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp-form-builder/v1`;
  
  try {
    const res = await fetch(`${apiBaseUrl}/forms/${formId}`, {
      next: { revalidate: 60 }, // Cache dynamic form schema for 60s
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching form ${formId}:`, error);
    return null;
  }
}

async function fetchFormDisplayInfo(formId: string) {
  const apiBaseUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp-form-builder/v1`;
  
  try {
    const res = await fetch(`${apiBaseUrl}/forms/${formId}/display-info`, {
      next: { revalidate: 10 }, // Revalidate availability check frequently (10s cache)
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching display info for form ${formId}:`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: FormPageProps): Promise<Metadata> {
  const { id } = await params;
  const form = await fetchFormData(id);

  if (!form) return generatePMCSEO({ title: "Formulário Não Encontrado" });

  return generatePMCSEO({
    title: form.title || "Formulário",
    description: form.description || "Preencha o formulário oficial do Município de Caxias.",
  });
}

export default async function FormPage({ params }: FormPageProps) {
  const { id } = await params;
  const form = await fetchFormData(id);

  if (!form) {
    notFound();
  }

  // Check form availability (status, expiration, simple and advanced response limits)
  const displayInfo = await fetchFormDisplayInfo(id);
  const isAvailable = displayInfo?.info ? !!displayInfo.info.available : (displayInfo ? !!displayInfo.available : true);
  const unavailableReason = displayInfo?.info?.reason || displayInfo?.reason || "Este formulário não está disponível para respostas no momento.";

  const apiBaseUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp-form-builder/v1`;

  const tradutorPtBr = {
    choose_file: "Selecionar Arquivo",
    no_file_chosen: "Nenhum arquivo selecionado",
    files_selected: "arquivos selecionados",
    submitting: "Enviando dados...",
    submit_success: "Formulário enviado com sucesso!",
    field_required: "Este campo é obrigatório.",
    invalid_email: "Insira um endereço de e-mail válido.",
    invalid_cpf: "CPF inválido.",
    invalid_cnpj: "CNPJ inválido.",
    invalid_url: "Insira uma URL válida.",
    min_characters: "Insira no mínimo {min} caracteres.",
    max_characters: "Insira no máximo {max} caracteres.",
    select_option: "Selecione uma opção",
    submission_failed: "Erro no envio do formulário.",
    submission_error: "Falha de conexão com o servidor."
  };

  return (
    <>
      <Header />

      <main className="grow bg-gray-50 py-12 md:py-20">
        <Container className="max-w-3xl">
          {!isAvailable ? (
            <div className="fbui-form-error feedback--error" style={{ display: 'block', padding: '16px' }}>
              <p className="fbui-error-message" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                {unavailableReason}
              </p>
            </div>
          ) : (
            <WPFBFormRenderer
              formData={form}
              apiBaseUrl={apiBaseUrl}
              locale={tradutorPtBr}
            />
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}

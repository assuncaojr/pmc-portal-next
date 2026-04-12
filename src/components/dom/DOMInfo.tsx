export function DOMInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-b border-gray-100 mt-16 mb-10">
      <div>
        <h4 className="font-bold text-pmc-primary mb-3">Legislação</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          Instituído pela{" "}
          <a href="#" className="text-pmc-primary underline">
            Lei nº 2.331/2017
          </a>
          , trata-se de uma publicação exclusivamente eletrônica, vinculada à
          Administração Direta deste Município.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-pmc-primary mb-3">Acervo</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          As edições do <strong>Diário Oficial do Município</strong> estão
          disponíveis online, por meio do endereço eletrônico:{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL || ''}/dom`}
            className="text-pmc-primary underline"
          >
            {process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://www.caxias.ma.gov.br'}/dom
          </a>
          . Para realizar pesquisas por termos específicos ou aplicar filtros de
          busca, utilize o campo de pesquisa disponível na mesma página.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-pmc-primary mb-3">Periodicidade</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          As edições do <strong>Diário Oficial do Município</strong>, são
          publicadas diariamente, exceto aos sábados, domingos e feriados.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-pmc-primary mb-3">Responsável</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          A relação dos responsáveis técnicos pela publicação do{" "}
          <strong>Diário Oficial do Município</strong> pode ser consultada na{" "}
          <a href="#" className="text-pmc-primary underline">
            edição publicada em 25 de abril de 2005
          </a>
          .
        </p>
      </div>
    </div>
  );
}

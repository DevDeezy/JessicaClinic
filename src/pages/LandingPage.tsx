import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Calendar,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center">
                <Heart className="w-5 h-5 text-cream-50" />
              </div>
              <span className="font-display text-2xl font-semibold text-sage-800">
                Jessica
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#servicos"
                className="text-sage-600 hover:text-sage-800 transition-colors"
              >
                Serviços
              </a>
              <a
                href="#sobre"
                className="text-sage-600 hover:text-sage-800 transition-colors"
              >
                Sobre Nós
              </a>
              <a
                href="#testemunhos"
                className="text-sage-600 hover:text-sage-800 transition-colors"
              >
                Testemunhos
              </a>
              <a
                href="#contacto"
                className="text-sage-600 hover:text-sage-800 transition-colors"
              >
                Contacto
              </a>
            </div>

            <Link
              to="/login"
              className="px-5 py-2.5 bg-sage-700 text-cream-50 rounded-xl font-medium hover:bg-sage-800 transition-all hover:shadow-lg hover:shadow-sage-200"
            >
              Área Profissional
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-terracotta-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-sage-200 rounded-full blur-3xl opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              <span className="text-sm font-medium text-sage-700">
                Cuidado personalizado para si
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl lg:text-7xl font-semibold leading-tight"
            >
              O seu caminho para uma{" "}
              <span className="gradient-text">vida sem dor</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-sage-600 max-w-xl leading-relaxed"
            >
              Na Jessica Fisioterapia, combinamos técnicas avançadas com um
              atendimento humanizado para ajudá-lo a recuperar a sua qualidade
              de vida.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <a
                href="#contacto"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-terracotta-500 text-white rounded-2xl font-semibold hover:bg-terracotta-600 transition-all hover:shadow-xl hover:shadow-terracotta-200"
              >
                Marcar Consulta
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-sage-700 rounded-2xl font-semibold border-2 border-sage-200 hover:border-sage-300 hover:bg-sage-50 transition-all"
              >
                Ver Serviços
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-8 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-sage-600">+500 pacientes</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-terracotta-400 text-terracotta-400"
                  />
                ))}
                <span className="text-sm text-sage-600 ml-2">4.9/5</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-sage-100 to-cream-100 p-8">
              <div className="absolute inset-0 rounded-3xl pattern-dots opacity-30" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-12 right-12 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <p className="font-semibold text-sage-800">
                    Consulta Marcada
                  </p>
                  <p className="text-sm text-sage-500">Amanhã às 10:00</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-20 left-8 bg-white rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-terracotta-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-terracotta-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sage-800">
                      98% Satisfação
                    </p>
                    <p className="text-sm text-sage-500">Pacientes felizes</p>
                  </div>
                </div>
              </motion.div>

              <div className="relative z-10 w-full h-full rounded-2xl bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white/50 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-sage-600" />
                  </div>
                  <p className="text-sage-700 font-medium">Cuidando de si</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 bg-sage-100 rounded-full text-sm font-medium text-sage-700 mb-4">
              Os Nossos Serviços
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-6">
              Tratamentos especializados para o seu bem-estar
            </h2>
            <p className="text-sage-600 text-lg">
              Oferecemos uma gama completa de serviços de fisioterapia adaptados
              às suas necessidades específicas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-7 h-7" />,
                title: "Fisioterapia Ortopédica",
                description:
                  "Tratamento de lesões músculo-esqueléticas, fraturas, e reabilitação pós-cirúrgica.",
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: "Fisioterapia Desportiva",
                description:
                  "Recuperação de atletas, prevenção de lesões e otimização do desempenho desportivo.",
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: "Terapia Manual",
                description:
                  "Técnicas manuais especializadas para alívio da dor e melhoria da mobilidade.",
              },
              {
                icon: <Clock className="w-7 h-7" />,
                title: "Drenagem Linfática",
                description:
                  "Tratamento para redução de edemas e melhoria da circulação linfática.",
              },
              {
                icon: <Sparkles className="w-7 h-7" />,
                title: "Reabilitação Neurológica",
                description:
                  "Recuperação funcional para pacientes com condições neurológicas.",
              },
              {
                icon: <Award className="w-7 h-7" />,
                title: "Eletroterapia",
                description:
                  "Uso de correntes elétricas terapêuticas para tratamento da dor e regeneração.",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl border-2 border-sage-100 hover:border-sage-200 bg-gradient-to-br from-white to-cream-50 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center text-sage-600 mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-sage-800">
                  {service.title}
                </h3>
                <p className="text-sage-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="sobre"
        className="py-24 bg-sage-800 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <span className="inline-block px-4 py-2 bg-sage-700 rounded-full text-sm font-medium text-sage-200">
                Sobre Nós
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold leading-tight">
                Mais de 10 anos a cuidar do seu bem-estar
              </h2>
              <p className="text-sage-200 text-lg leading-relaxed">
                A nossa clínica foi fundada com a missão de proporcionar
                cuidados de fisioterapia de excelência, combinando conhecimento
                científico avançado com um atendimento verdadeiramente
                personalizado.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "500+", label: "Pacientes Atendidos" },
                  { number: "10+", label: "Anos de Experiência" },
                  { number: "98%", label: "Taxa de Satisfação" },
                  { number: "15+", label: "Especialidades" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-6 bg-sage-700/50 rounded-2xl"
                  >
                    <p className="font-display text-3xl font-bold text-terracotta-400">
                      {stat.number}
                    </p>
                    <p className="text-sage-300 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-sage-700 to-sage-600 p-8 relative">
                <div className="absolute top-4 right-4 w-20 h-20 bg-terracotta-500 rounded-full opacity-30" />
                <div className="absolute bottom-8 left-8 w-32 h-32 bg-cream-400 rounded-full opacity-20" />
                <div className="relative z-10 w-full h-full rounded-2xl bg-sage-500/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Award className="w-16 h-16 mx-auto text-terracotta-400" />
                    <p className="text-xl font-semibold">
                      Excelência em Fisioterapia
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testemunhos" className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium text-sage-700 mb-4">
              Testemunhos
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-6">
              O que dizem os nossos pacientes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ana Rodrigues",
                role: "Atleta Amadora",
                content:
                  "Após uma lesão no joelho, a equipa da Jessica ajudou-me a recuperar completamente. Voltei a correr em apenas 3 meses!",
              },
              {
                name: "Carlos Mendes",
                role: "Empresário",
                content:
                  "As dores nas costas que me acompanhavam há anos desapareceram após o tratamento. Profissionais extraordinários!",
              },
              {
                name: "Sofia Costa",
                role: "Professora",
                content:
                  "O atendimento personalizado faz toda a diferença. Sinto-me sempre bem acompanhada e os resultados são visíveis.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-terracotta-400 text-terracotta-400"
                    />
                  ))}
                </div>
                <p className="text-sage-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-300 to-sage-500" />
                  <div>
                    <p className="font-semibold text-sage-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-sage-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <span className="inline-block px-4 py-2 bg-sage-100 rounded-full text-sm font-medium text-sage-700">
                Contacte-nos
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold">
                Pronto para começar a sua recuperação?
              </h2>
              <p className="text-sage-600 text-lg">
                Entre em contacto connosco para agendar a sua consulta de
                avaliação.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Phone className="w-6 h-6" />,
                    label: "Telefone",
                    value: "+351 912 345 678",
                  },
                  {
                    icon: <Mail className="w-6 h-6" />,
                    label: "Email",
                    value: "geral@jessica.pt",
                  },
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    label: "Morada",
                    value: "Rua da Saúde, 123, Lisboa",
                  },
                  {
                    icon: <Clock className="w-6 h-6" />,
                    label: "Horário",
                    value: "Seg-Sex: 9h-20h | Sáb: 9h-13h",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center text-sage-600">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-sage-500">{item.label}</p>
                      <p className="font-semibold text-sage-800">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form className="bg-cream-50 p-8 rounded-3xl space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all bg-white"
                      placeholder="O seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all bg-white"
                      placeholder="+351 XXX XXX XXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all bg-white"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all bg-white resize-none"
                    placeholder="Descreva brevemente o motivo do contacto..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-terracotta-500 text-white rounded-xl font-semibold hover:bg-terracotta-600 transition-all hover:shadow-lg"
                >
                  Enviar Mensagem
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage-900 text-sage-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-600 to-sage-700 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-cream-50" />
                </div>
                <span className="font-display text-2xl font-semibold text-white">
                  Jessica
                </span>
              </Link>
              <p className="text-sage-400">
                Cuidando do seu bem-estar há mais de 10 anos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#servicos"
                    className="hover:text-white transition-colors"
                  >
                    Serviços
                  </a>
                </li>
                <li>
                  <a
                    href="#sobre"
                    className="hover:text-white transition-colors"
                  >
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a
                    href="#testemunhos"
                    className="hover:text-white transition-colors"
                  >
                    Testemunhos
                  </a>
                </li>
                <li>
                  <a
                    href="#contacto"
                    className="hover:text-white transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Serviços</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fisioterapia Ortopédica
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fisioterapia Desportiva
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terapia Manual
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Reabilitação
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li>+351 912 345 678</li>
                <li>geral@jessica.pt</li>
                <li>Rua da Saúde, 123</li>
                <li>Lisboa, Portugal</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sage-800 pt-8 text-center text-sage-400">
            <p>
              © {new Date().getFullYear()} Jessica Fisioterapia. Todos os
              direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

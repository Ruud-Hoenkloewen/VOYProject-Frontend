import {
  Badge,
  Button,
  Card,
  Chip,
  Container,
  EventCard,
  Input,
  Navbar,
  SearchBar,
  Stack,
  Typography,
} from "../design-system";
import DocItem from "../design-system/docs/DocItem";
import styles from "../design-system/docs/DesignSystemPreview.module.css";

const sampleCards = [
  {
    title: "Noche de Furia en el Nesta",
    date: "15 MAY 2026",
    time: "23:00 HS",
    venue: "Robert Nesta Club",
    price: "$4.500",
    genres: ["PUNK", "GRUNGE"],
    status: "DISPONIBLE",
    statusTone: "success",
  },
  {
    title: "Techno Invasion",
    date: "22 MAY 2026",
    time: "01:00 HS",
    venue: "Magic Music Box",
    price: "$6.000",
    genres: ["TECHNO", "ELECTRONICA"],
    status: "ULTIMAS ENTRADAS",
    statusTone: "warning",
    highlighted: true,
  },
  {
    title: "Ciclo Ruido: Edicion Metal",
    date: "05 JUL 2026",
    time: "22:00 HS",
    venue: "Bar Irlanda",
    price: "$3.500",
    genres: ["METAL", "HARDCORE"],
    status: "AGOTADO",
    statusTone: "danger",
  },
];

export default function DesignSystemPreview() {
  return (
    <Container>
      <Stack gap="lg" className={styles.page}>
        <section className={styles.section}>
          <Typography variant="display">Design System Preview</Typography>
          <Typography variant="caption">Undertuc Ticketing - documentacion visual unificada</Typography>
        </section>

        <section className={styles.section}>
          <Typography variant="h2">Typography</Typography>
          <Stack>
            <Typography variant="display">Movida Tucumana</Typography>
            <Typography variant="h2">Section Heading</Typography>
            <Typography variant="h3">Card Heading</Typography>
            <Typography variant="body">Texto base para descripcion y contenido normal.</Typography>
            <Typography variant="label">Label</Typography>
            <Typography variant="caption">Caption / Metadata</Typography>
          </Stack>
        </section>

        <section className={styles.section}>
          <Typography variant="h2">Buttons</Typography>
          <div className={styles.row}>
            <Button>Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        <section className={styles.section}>
          <Typography variant="h2">Inputs y Search</Typography>
          <Stack>
            <Input placeholder="Input base..." />
            <SearchBar />
          </Stack>
        </section>

        <section className={styles.section}>
          <Typography variant="h2">Badges y Chips</Typography>
          <div className={styles.row}>
            <Badge tone="success">Disponible</Badge>
            <Badge tone="warning">Ultimas entradas</Badge>
            <Badge tone="danger">Agotado</Badge>
            <Chip>Punk</Chip>
            <Chip active>Techno</Chip>
          </div>
        </section>

        <section className={styles.section}>
          <Typography variant="h2">Card Primitive</Typography>
          <Card className={styles.cardPrimitive}>
            <Typography variant="h3">Card Base</Typography>
            <Typography variant="body">Contenedor reutilizable para composites.</Typography>
          </Card>
        </section>

        <section className={styles.section}>
          <Typography variant="h2">Event Cards</Typography>
          <div className={styles.grid}>
            {sampleCards.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <Typography variant="h2">Navbar (Composite)</Typography>
          <Navbar />
        </section>

        <section className={styles.section}>
          <Typography variant="h2">Componentes documentados</Typography>
          <DocItem
            name="Button"
            description="Acciones primarias y secundarias de la interfaz."
            implementation={'<Button variant="primary">Crear Evento</Button>'}
          >
            <Button>Crear Evento</Button>
          </DocItem>
          <DocItem
            name="Input"
            description="Ingreso de texto para filtros, formularios y busqueda."
            implementation={'<Input placeholder="Buscar..." />'}
          >
            <div className={styles.previewInput}>
              <Input placeholder="Buscar..." />
            </div>
          </DocItem>
          <DocItem
            name="Badge"
            description="Estado rapido de disponibilidad o criticidad."
            implementation={'<Badge tone="danger">Agotado</Badge>'}
          >
            <Badge tone="danger">Agotado</Badge>
          </DocItem>
          <DocItem
            name="Chip"
            description="Etiquetas compactas para categorias o filtros activos."
            implementation={"<Chip active>Techno</Chip>"}
          >
            <Chip active>Techno</Chip>
          </DocItem>
          <DocItem
            name="SearchBar"
            description="Buscador compuesto con icono y campo de entrada."
            implementation={"<SearchBar />"}
          >
            <div className={styles.previewSearch}>
              <SearchBar />
            </div>
          </DocItem>
          <DocItem
            name="EventCard"
            description="Resumen visual de evento con estado, metadata y precio."
            implementation={'<EventCard status="DISPONIBLE" />'}
          >
            <div className={styles.previewCard}>
              <EventCard />
            </div>
          </DocItem>
        </section>
      </Stack>
    </Container>
  );
}

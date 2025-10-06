import Image from 'next/image';

export default function AboutPage() {
    return (
        <main style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem' }}>
            <h1>About Me</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Image
                    src="/images/your-photo.jpg" // Replace with your actual image path
                    alt="Photo of Brandon Gill"
                    width={180}
                    height={180}
                    style={{ borderRadius: '50%' }}
                />
                <section>
                    <p>
                        Hi, I&apos;m Brandon Gill. I&apos;m a passionate developer with experience in building modern web applications.
                        I enjoy learning new technologies and creating projects that make a difference.
                    </p>
                </section>
            </div>
        </main>
    );
}
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import Logo from '../assets/img/SKYBRIDGE_LOGO.webp';

// Register a standard font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 5,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 9,
    marginBottom: 1,
  },
  formTitle: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    fontSize: 12,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
  },
  separator: {
    width: 10,
    textAlign: 'center',
  },
  value: {
    flex: 1,
  },
  photoBox: {
    width: 80,
    height: 106, // 3x4 ratio roughly
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  photoText: {
    fontSize: 8,
    color: '#ccc',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 5,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#000',
  },
  tableCell: {
    margin: 2,
    fontSize: 8,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    textAlign: 'center',
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  signatureBox: {
    alignItems: 'center',
    width: 150,
  },
  signatureLine: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: '100%',
    textAlign: 'center',
    paddingTop: 5,
  }
});

const StudentPDF = ({ students }) => (
  <Document>
    {students.map((student) => (
      <Page key={student.id} size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
            <Image src={Logo} style={styles.logo} />
            <View style={styles.headerText}>
                <Text style={styles.title}>SKYBRIDGE</Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>(Japanesse Education Center)</Text>
                <Text style={styles.subtitle}>Komplek Pertokoan Grand Lingkar No.7 Sebelah Utara Kantor PT. Varindo Lombok Inti</Text>
                <Text style={styles.subtitle}>Jalan Gajah Mada Kelurahan Jempong Baru, Kecamatan Sekarbela, Kota Mataram</Text>
                <Text style={styles.subtitle}>Nusa Tenggara Barat Kode Pos 83116 Telepon ( 0370 ) 7856824</Text>
                <Text style={styles.subtitle}>Handphone +6282145600028 Email Adres: doryouku@gmail.com</Text>
            </View>
        </View>

        <Text style={styles.formTitle}>FORMULIR PENDAFTARAN</Text>
        <Text style={{ textAlign: 'center', fontSize: 9, marginBottom: 10 }}>Nomor: {student.registration_number}</Text>

        {/* A. Keterangan Pribadi */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>A. KETERANGAN PRIBADI</Text>
            <View style={{ position: 'relative' }}>
                <View style={{ width: '75%' }}>
                    <Field label="1. Nomor KTP" value={student.nik} />
                    <Field label="2. Nama Lengkap" value={student.full_name} />
                    <Field label="3. Jenis Kelamin" value={student.gender} />
                    <Field label="4. Tempat / Tgl. Lahir" value={`${student.place_of_birth}, ${new Date(student.date_of_birth).toLocaleDateString('id-ID')}`} />
                    <Field label="5. Golongan Darah" value={student.blood_type || '-'} />
                    <Field label="6. Agama" value={student.religion} />
                    <Field label="7. Alamat" value={student.address} />
                    <Field label="8. Status" value={student.marital_status} />
                    <Field label="9. No. Telpon / HP" value={student.phone_number} />
                    <Field label="10. Email" value={student.email} />
                </View>
                
                {/* Photo Box */}
                <View style={styles.photoBox}>
                    {student.photo_path ? (
                        <Image 
                            src={`http://localhost:5001/${student.photo_path.replace(/\\/g, '/')}`} 
                            style={styles.photoImage} 
                        />
                    ) : (
                        <Text style={styles.photoText}>3 X 4</Text>
                    )}
                </View>
            </View>
        </View>

        {/* B. Pendidikan */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>B. PENDIDIKAN</Text>
            <View style={styles.table}>
                {/* Header */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>No</Text></View>
                    <View style={[styles.tableCol, { width: '35%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>Nama Sekolah</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Tanggal Masuk</Text>
                        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#000' }}>
                             <View style={{ width: '50%', borderRightWidth: 1, borderColor: '#000' }}><Text style={[styles.tableCell, styles.tableHeader]}>Bulan</Text></View>
                             <View style={{ width: '50%' }}><Text style={[styles.tableCell, styles.tableHeader]}>Tahun</Text></View>
                        </View>
                    </View>
                    <View style={[styles.tableCol, { width: '30%' }]}>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Tanggal Wisuda</Text>
                        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#000' }}>
                             <View style={{ width: '50%', borderRightWidth: 1, borderColor: '#000' }}><Text style={[styles.tableCell, styles.tableHeader]}>Bulan</Text></View>
                             <View style={{ width: '50%' }}><Text style={[styles.tableCell, styles.tableHeader]}>Tahun</Text></View>
                        </View>
                    </View>
                </View>

                {/* Rows */}
                {[
                    { key: 'SD/MI', label: 'SD/MI' },
                    { key: 'SMP/MTS', label: 'SMP/MTS' },
                    { key: 'SMA/SMK', label: 'SMA/SMK' },
                    { key: 'D3/S1', label: 'D3/Strata1' }
                ].map((item, idx) => {
                    const edu = student.education?.find(e => e.level === item.key) || {};
                    return (
                        <View key={item.key} style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>{idx + 1}</Text></View>
                            <View style={[styles.tableCol, { width: '35%' }]}><Text style={styles.tableCell}>{item.label} {edu.school_name ? `- ${edu.school_name}` : ''}</Text></View>
                            
                            {/* Entry Date */}
                            <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>{edu.entry_month || ''}</Text></View>
                            <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>{edu.entry_year || ''}</Text></View>

                            {/* Graduation Date */}
                            <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>{edu.graduation_month || ''}</Text></View>
                            <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>{edu.graduation_year || ''}</Text></View>
                        </View>
                    );
                })}
            </View>
        </View>

        {/* C. Orang Tua */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>C. ORANG TUA</Text>
            <View>
                <Field label="1. Nama Orang Tua" value={`a. Ayah : ${student.family?.father_name || '-'}`} />
                <Field label="" value={`b. Ibu   : ${student.family?.mother_name || '-'}`} />
                
                <Field label="2. Pekerjaan Orang Tua" value={`a. Ayah : ${student.family?.father_job || '-'}`} />
                <Field label="" value={`b. Ibu   : ${student.family?.mother_job || '-'}`} />
                
                <Field label="3. Keadaan Orang Tua" value={`a. Ayah : ${student.family?.father_status || '-'}`} />
                <Field label="" value={`b. Ibu   : ${student.family?.mother_status || '-'}`} />

                <Field label="4. Alamat Orang Tua" value={student.family?.parent_address || '-'} />
                <Field label="5. Nama Wali Siswa" value={student.family?.guardian_name || '-'} />
                <Field label="6. Alamat Wali" value={student.family?.guardian_address || '-'} />
                <Field label="7. No. Telpon / HP" value={student.family?.guardian_phone || '-'} />
            </View>
        </View>

        {/* D. Syarat-Syarat */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>D. SYARAT-SYARAT DAN YANG DILAMPIRKAN</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>No</Text></View>
                    <View style={[styles.tableCol, { width: '45%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>Syarat-syarat</Text></View>
                    <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>Banyak</Text></View>
                    <View style={[styles.tableCol, { width: '17.5%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>Ada</Text></View>
                    <View style={[styles.tableCol, { width: '17.5%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>Tidak Ada</Text></View>
                </View>

                {[
                    { name: 'Fotocopy ijazah terakhir yang dilegalisir', key: 'diploma_path' },
                    { name: 'Fotocopy KTP/SIM', key: 'ktp_path' },
                    { name: 'Pas photo ukuran 3x4 cm hitam putih', key: 'photo_path' }, // Assume 2 lembar based on screenshot
                    { name: 'Kartu keterangan sehat', key: 'health_certificate_path' },
                    { name: 'Surat pernyataan kesediaan', key: 'consent_letter_path' },
                    { name: 'Fotocopy kartu keluarga', key: 'family_card_path' },
                    { name: 'Fotocopy akta kelahiran', key: 'birth_certificate_path' },
                ].map((item, idx) => (
                    <View key={idx} style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>{idx + 1}</Text></View>
                        <View style={[styles.tableCol, { width: '45%' }]}><Text style={styles.tableCell}>{item.name}</Text></View>
                        <View style={[styles.tableCol, { width: '15%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>
                            {item.name.includes('photo') ? '2 Lembar' : '1 Lembar'}
                        </Text></View>
                        {/* Checkmark logic */}
                        <View style={[styles.tableCol, { width: '17.5%' }]}><Text style={[styles.tableCell, {textAlign: 'center', fontFamily: 'Helvetica-Bold'}]}>
                            {student[item.key] ? 'V' : ''}
                        </Text></View>
                        <View style={[styles.tableCol, { width: '17.5%' }]}><Text style={[styles.tableCell, {textAlign: 'center', fontFamily: 'Helvetica-Bold'}]}>
                            {!student[item.key] ? 'V' : ''}
                        </Text></View>
                    </View>
                ))}
            </View>
        </View>

        {/* E. Test Fisik */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>E. TEST FISIK</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>No</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>Keadaan Fisik</Text></View>
                    <View style={[styles.tableCol, { width: '35%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>Data Fisik</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={[styles.tableCell, styles.tableHeader]}>Keterangan</Text></View>
                </View>
                
                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>1</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>Tato</Text></View>
                    <View style={[styles.tableCol, { width: '35%', flexDirection: 'row', justifyContent: 'space-around' }]}>
                        <Text style={styles.tableCell}>Ya {student.has_tattoo ? '(V)' : '( )'}</Text>
                        <Text style={styles.tableCell}>Tidak {!student.has_tattoo ? '(V)' : '( )'}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: '30%' }]}></View>
                </View>

                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>2</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>Tindik</Text></View>
                    <View style={[styles.tableCol, { width: '35%', flexDirection: 'row', justifyContent: 'space-around' }]}>
                         <Text style={styles.tableCell}>Ya {student.has_piercing ? '(V)' : '( )'}</Text>
                        <Text style={styles.tableCell}>Tidak {!student.has_piercing ? '(V)' : '( )'}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: '30%' }]}></View>
                </View>

                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>3</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>Tinggi Badan</Text></View>
                    <View style={[styles.tableCol, { width: '35%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>{student.height || '...'} Cm</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}></View>
                </View>

                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '5%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>4</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>Berat Badan</Text></View>
                    <View style={[styles.tableCol, { width: '35%' }]}><Text style={[styles.tableCell, {textAlign: 'center'}]}>{student.weight || '...'} Kg</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}></View>
                </View>
            </View>
        </View>

        {/* Footer / Signatures */}
        <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
                <Text style={{ fontSize: 9 }}>Nama Peserta</Text>
                <Text style={{ fontSize: 9 }}>Magang / TG</Text>
                <View style={styles.signatureLine}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{student.full_name}</Text>
                </View>
            </View>

            <View style={styles.signatureBox}>
                <Text style={{ fontSize: 9 }}>Mataram, ...................................2025</Text>
                <Text style={{ fontSize: 9 }}>Mengetahui</Text>
                <Text style={{ fontSize: 9 }}>Staff Admin</Text>
                <View style={styles.signatureLine}>
                    <Text style={{ fontSize: 9 }}>( ..................................................... )</Text>
                </View>
            </View>
        </View>

      </Page>
    ))}
  </Document>
);

const Field = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

export default StudentPDF;
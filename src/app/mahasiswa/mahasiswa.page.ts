import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.page.html',
  styleUrls: ['./mahasiswa.page.scss'],
})
export class MahasiswaPage implements OnInit {
  dataMahasiswa: any;
  modalTambah: any;
  modalEdit: any;
  id: any;
  nama: any;
  jurusan: any;

  constructor(private api: ApiService, private alertController: AlertController) {}

  ngOnInit() {
    this.getMahasiswa();
  }

  resetModal() {
    this.id = null;
    this.nama = '';
    this.jurusan = '';
  }

  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }

  cancel() {
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  getMahasiswa() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataMahasiswa = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  tambahMahasiswa() {
    if (this.nama && this.jurusan) {
      const data = { nama: this.nama, jurusan: this.jurusan };
      this.api.tambah(data, 'tambah.php').subscribe({
        next: () => {
          this.resetModal();
          this.getMahasiswa();
          this.modalTambah = false;
        },
        error: () => {
          console.log('Gagal menambahkan mahasiswa');
        },
      });
    }
  }

  async confirmDelete(id: any) {
    const alert = await this.alertController.create({
      message: 'Apakah Anda yakin ingin menghapus mahasiswa ini?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
        },
        {
          text: 'Ya',
          handler: () => {
            this.hapusMahasiswa(id);
          },
        },
      ],
    });
    await alert.present();
  }

  hapusMahasiswa(id: any) {
    this.api.hapus(id, 'hapus.php?id=').subscribe({
      next: () => {
        this.getMahasiswa();
        console.log('Berhasil menghapus data');
      },
      error: () => {
        console.log('Gagal menghapus data');
      },
    });
  }

  ambilMahasiswa(id: any) {
    this.api.lihat(id, 'lihat.php?id=').subscribe({
      next: (hasil: any) => {
        this.id = hasil.id;
        this.nama = hasil.nama;
        this.jurusan = hasil.jurusan;
      },
      error: () => {
        console.log('Gagal mengambil data');
      },
    });
  }

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    this.ambilMahasiswa(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }

  editMahasiswa() {
    const data = { id: this.id, nama: this.nama, jurusan: this.jurusan };
    this.api.edit(data, 'edit.php').subscribe({
      next: () => {
        this.resetModal();
        this.getMahasiswa();
        this.modalEdit = false;
      },
      error: () => {
        console.log('Gagal mengedit mahasiswa');
      },
    });
  }
}

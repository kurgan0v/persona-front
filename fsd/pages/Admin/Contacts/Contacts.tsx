import s from './Contacts.module.scss';
import ContactsForm from "@/fsd/widgets/Admin/ContactsForm/ContactsForm";

export default function Contacts() {
    return (
        <div className={s.wrapper}>
            <h2>Контакты</h2>
            <ContactsForm/>
        </div>
    )
}
